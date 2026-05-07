package services

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/zerocrypt1/QBITRA/backend/config"
	"github.com/zerocrypt1/QBITRA/backend/constants"
	"github.com/zerocrypt1/QBITRA/backend/models"
	"github.com/zerocrypt1/QBITRA/backend/repositories"
	"github.com/zerocrypt1/QBITRA/backend/utils"
	"github.com/zerocrypt1/QBITRA/backend/validators"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type AuthService interface {
	Signup(ctx context.Context, email, username, password, ip, ua string) (*models.User, string, string, error)
	Login(ctx context.Context, email, password, ip, ua string) (*models.User, string, string, error)
	RotateTokens(ctx context.Context, refreshToken, ip, ua string) (string, string, error)
	Logout(ctx context.Context, refreshToken string) error
	GenerateOTP(ctx context.Context, email string) (string, error)
	VerifyOTP(ctx context.Context, email, otp string) error
}

type authService struct {
	cfg      *config.Config
	users    repositories.UserRepository
	sessions repositories.SessionRepository
	redis    *redis.Client
	logger   *slog.Logger
}

func NewAuthService(cfg *config.Config, users repositories.UserRepository, sessions repositories.SessionRepository, redis *redis.Client, logger *slog.Logger) AuthService {
	return &authService{cfg: cfg, users: users, sessions: sessions, redis: redis, logger: logger}
}

func (s *authService) Signup(ctx context.Context, email, username, password, ip, ua string) (*models.User, string, string, error) {
	if err := validators.ValidateStrongPassword(password); err != nil {
		return nil, "", "", err
	}
	hash, err := utils.HashPassword(password)
	if err != nil {
		return nil, "", "", err
	}
	u := &models.User{Email: email, Username: username, PasswordHash: hash, Role: constants.RoleUser, Rating: 1200}
	if err := s.users.Create(ctx, u); err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, "", "", errors.New("email or username already exists")
		}
		return nil, "", "", err
	}
	at, rt, err := s.issueSession(ctx, u.ID.Hex(), u.Role, ip, ua)
	if err != nil {
		return nil, "", "", err
	}
	return u, at, rt, nil
}

func (s *authService) Login(ctx context.Context, email, password, ip, ua string) (*models.User, string, string, error) {
	u, err := s.users.FindByEmail(ctx, email)
	if err != nil {
		return nil, "", "", errors.New("invalid credentials")
	}
	if u.LockedUntilUnix > time.Now().Unix() {
		return nil, "", "", errors.New("account temporarily locked")
	}
	if !utils.ComparePassword(u.PasswordHash, password) {
		failed := u.FailedLogins + 1
		update := bson.M{"failed_logins": failed}
		if failed >= s.cfg.LoginMaxAttempts {
			update["locked_until_unix"] = time.Now().Add(time.Duration(s.cfg.LoginLockoutMinutes) * time.Minute).Unix()
			update["failed_logins"] = 0
		}
		_ = s.users.UpdateByID(ctx, u.ID, update)
		return nil, "", "", errors.New("invalid credentials")
	}
	_ = s.users.UpdateByID(ctx, u.ID, bson.M{"failed_logins": 0, "locked_until_unix": int64(0)})
	at, rt, err := s.issueSession(ctx, u.ID.Hex(), u.Role, ip, ua)
	if err != nil {
		return nil, "", "", err
	}
	return u, at, rt, nil
}

func (s *authService) RotateTokens(ctx context.Context, refreshToken, ip, ua string) (string, string, error) {
	claims, err := utils.ParseToken(s.cfg.JWTRefreshSecret, refreshToken)
	if err != nil || claims.Type != "refresh" {
		return "", "", errors.New("invalid refresh token")
	}
	session, err := s.sessions.FindByRefreshJTI(ctx, claims.ID)
	if err != nil {
		return "", "", errors.New("session not found")
	}
	if !session.RevokedAt.IsZero() || session.ExpiresAt.Before(time.Now().UTC()) {
		return "", "", errors.New("refresh token revoked or expired")
	}
	if session.IPHash != hashPII(ip) || session.UserAgentHash != hashPII(ua) {
		return "", "", errors.New("session context mismatch")
	}
	_ = s.sessions.RevokeByRefreshJTI(ctx, claims.ID)
	return s.issueSession(ctx, claims.UserID, claims.Role, ip, ua)
}

func (s *authService) Logout(ctx context.Context, refreshToken string) error {
	claims, err := utils.ParseToken(s.cfg.JWTRefreshSecret, refreshToken)
	if err != nil {
		return errors.New("invalid refresh token")
	}
	return s.sessions.RevokeByRefreshJTI(ctx, claims.ID)
}

func (s *authService) GenerateOTP(ctx context.Context, email string) (string, error) {
	otp := fmt.Sprintf("%06d", time.Now().UnixNano()%1000000)
	key := fmt.Sprintf("otp:%s", email)
	if err := s.redis.Set(ctx, key, otp, 10*time.Minute).Err(); err != nil {
		return "", err
	}
	return otp, nil
}

func (s *authService) VerifyOTP(ctx context.Context, email, otp string) error {
	key := fmt.Sprintf("otp:%s", email)
	actual, err := s.redis.Get(ctx, key).Result()
	if err != nil {
		return errors.New("otp expired or invalid")
	}
	if actual != otp {
		return errors.New("invalid otp")
	}
	return s.redis.Del(ctx, key).Err()
}

func (s *authService) issueSession(ctx context.Context, userID, role, ip, ua string) (string, string, error) {
	accessToken, _, err := utils.GenerateToken(s.cfg.JWTAccessSecret, userID, role, "access", s.cfg.JWTAccessTTL)
	if err != nil {
		return "", "", err
	}
	refreshToken, refreshJTI, err := utils.GenerateToken(s.cfg.JWTRefreshSecret, userID, role, "refresh", s.cfg.JWTRefreshTTL)
	if err != nil {
		return "", "", err
	}
	session := &models.Session{UserID: userID, RefreshJTI: refreshJTI, IPHash: hashPII(ip), UserAgentHash: hashPII(ua), ExpiresAt: time.Now().UTC().Add(s.cfg.JWTRefreshTTL)}
	if err := s.sessions.Create(ctx, session); err != nil {
		return "", "", err
	}
	return accessToken, refreshToken, nil
}

func hashPII(v string) string {
	sum := sha256.Sum256([]byte(v))
	return hex.EncodeToString(sum[:])
}
