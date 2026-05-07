package utils

import (
	"html"
	"regexp"
	"strings"
)

var mongoOp = regexp.MustCompile(`\$(where|gt|gte|lt|lte|ne|regex|expr|function)`)

func SanitizeHTML(input string) string {
	return html.EscapeString(strings.TrimSpace(input))
}

func RejectUnsafeMongoOperators(input string) bool {
	return mongoOp.MatchString(strings.ToLower(input))
}
