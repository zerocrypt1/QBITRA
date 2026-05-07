package tests

import (
	"testing"
	"time"

	"github.com/zerocrypt1/QBITRA/backend/utils"
	"github.com/zerocrypt1/QBITRA/backend/validators"
)

func TestPasswordStrength(t *testing.T) {
	if err := validators.ValidateStrongPassword("weak"); err == nil {
		t.Fatal("expected weak password to fail")
	}
	if err := validators.ValidateStrongPassword("StrongPassword#2026"); err != nil {
		t.Fatalf("expected strong password to pass: %v", err)
	}
}

func TestJWTRoundTrip(t *testing.T) {
	secret := "12345678901234567890123456789012"
	tok, _, err := utils.GenerateToken(secret, "u1", "user", "access", time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	claims, err := utils.ParseToken(secret, tok)
	if err != nil {
		t.Fatal(err)
	}
	if claims.UserID != "u1" || claims.Role != "user" || claims.Type != "access" {
		t.Fatalf("unexpected claims: %+v", claims)
	}
}
