package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	AppEnv              string
	Port                string
	AllowedOrigins      []string
	MongoURI            string
	MongoDBName         string
	RedisAddr           string
	RedisPassword       string
	RedisDB             int
	JWTAccessSecret     string
	JWTRefreshSecret    string
	JWTAccessTTL        time.Duration
	JWTRefreshTTL       time.Duration
	S3Region            string
	S3Bucket            string
	S3AccessKeyID       string
	S3SecretAccessKey   string
	BrevoAPIKey         string
	BrevoSenderEmail    string
	BrevoSenderName     string
	BaseURL             string
	AsynqConcurrency    int
	TrustedProxyCIDRs   []string
	CSRFEnabled         bool
	CookieSecure        bool
	LoginMaxAttempts    int
	LoginLockoutMinutes int
}

func Load() (*Config, error) {
	cfg := &Config{
		AppEnv:              getEnv("APP_ENV", "development"),
		Port:                getEnv("PORT", "8080"),
		AllowedOrigins:      splitCSV(getEnv("ALLOWED_ORIGINS", "http://localhost:5173")),
		MongoURI:            os.Getenv("MONGO_URI"),
		MongoDBName:         getEnv("MONGO_DB_NAME", "qbitra"),
		RedisAddr:           getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:       os.Getenv("REDIS_PASSWORD"),
		RedisDB:             getEnvInt("REDIS_DB", 0),
		JWTAccessSecret:     os.Getenv("JWT_ACCESS_SECRET"),
		JWTRefreshSecret:    os.Getenv("JWT_REFRESH_SECRET"),
		JWTAccessTTL:        getEnvDuration("JWT_ACCESS_TTL", 15*time.Minute),
		JWTRefreshTTL:       getEnvDuration("JWT_REFRESH_TTL", 720*time.Hour),
		S3Region:            getEnv("S3_REGION", "us-east-1"),
		S3Bucket:            os.Getenv("S3_BUCKET"),
		S3AccessKeyID:       os.Getenv("S3_ACCESS_KEY_ID"),
		S3SecretAccessKey:   os.Getenv("S3_SECRET_ACCESS_KEY"),
		BrevoAPIKey:         os.Getenv("BREVO_API_KEY"),
		BrevoSenderEmail:    getEnv("BREVO_SENDER_EMAIL", "noreply@qbitra.com"),
		BrevoSenderName:     getEnv("BREVO_SENDER_NAME", "QBITRA"),
		BaseURL:             getEnv("BASE_URL", "http://localhost:8080"),
		AsynqConcurrency:    getEnvInt("ASYNQ_CONCURRENCY", 10),
		TrustedProxyCIDRs:   splitCSV(getEnv("TRUSTED_PROXY_CIDRS", "")),
		CSRFEnabled:         getEnvBool("CSRF_ENABLED", true),
		CookieSecure:        getEnvBool("COOKIE_SECURE", true),
		LoginMaxAttempts:    getEnvInt("LOGIN_MAX_ATTEMPTS", 5),
		LoginLockoutMinutes: getEnvInt("LOGIN_LOCKOUT_MINUTES", 15),
	}
	if err := cfg.Validate(); err != nil {
		return nil, err
	}
	return cfg, nil
}

func (c *Config) Validate() error {
	var errs []string
	if c.MongoURI == "" {
		errs = append(errs, "MONGO_URI is required")
	}
	if c.JWTAccessSecret == "" || len(c.JWTAccessSecret) < 32 {
		errs = append(errs, "JWT_ACCESS_SECRET must be at least 32 chars")
	}
	if c.JWTRefreshSecret == "" || len(c.JWTRefreshSecret) < 32 {
		errs = append(errs, "JWT_REFRESH_SECRET must be at least 32 chars")
	}
	if c.S3Bucket == "" {
		errs = append(errs, "S3_BUCKET is required")
	}
	if c.BrevoAPIKey == "" {
		errs = append(errs, "BREVO_API_KEY is required")
	}
	if len(errs) > 0 {
		return errors.New(strings.Join(errs, "; "))
	}
	return nil
}

func getEnv(key, fallback string) string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	return v
}

func getEnvInt(key string, fallback int) int {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}
	return n
}

func getEnvBool(key string, fallback bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return fallback
	}
	return b
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return fallback
	}
	return d
}

func splitCSV(v string) []string {
	if strings.TrimSpace(v) == "" {
		return []string{}
	}
	parts := strings.Split(v, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func (c *Config) Addr() string {
	return fmt.Sprintf(":%s", c.Port)
}
