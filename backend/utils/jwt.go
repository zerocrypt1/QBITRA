package utils

import (
"errors"
"time"

"github.com/golang-jwt/jwt/v5"
"github.com/google/uuid"
)

type TokenClaims struct {
UserID string `json:"uid"`
Role   string `json:"role"`
Type   string `json:"typ"`
jwt.RegisteredClaims
}

func GenerateToken(secret, userID, role, tokenType string, ttl time.Duration) (string, string, error) {
jti := uuid.NewString()
claims := TokenClaims{
UserID: userID,
Role:   role,
Type:   tokenType,
RegisteredClaims: jwt.RegisteredClaims{
ExpiresAt: jwt.NewNumericDate(time.Now().UTC().Add(ttl)),
IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
ID:        jti,
},
}
t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
signed, err := t.SignedString([]byte(secret))
if err != nil {
return "", "", err
}
return signed, jti, nil
}

func ParseToken(secret, token string) (*TokenClaims, error) {
parsed, err := jwt.ParseWithClaims(token, &TokenClaims{}, func(t *jwt.Token) (interface{}, error) {
if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
return nil, errors.New("invalid token signing method")
}
return []byte(secret), nil
})
if err != nil {
return nil, err
}
claims, ok := parsed.Claims.(*TokenClaims)
if !ok || !parsed.Valid {
return nil, errors.New("invalid token")
}
return claims, nil
}
