package repositories

import (
	"errors"
	"net/mail"
	"regexp"
)

var (
	safeIDRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{6,128}$`)
)

func validateEmail(email string) error {
	_, err := mail.ParseAddress(email)
	return err
}

func validateSafeID(value string) error {
	if !safeIDRegex.MatchString(value) {
		return errors.New("invalid identifier format")
	}
	return nil
}
