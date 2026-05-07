package middleware

import (
"net/http"
"strings"

"github.com/gin-gonic/gin"
"github.com/google/uuid"
)

func CSRFCookie() gin.HandlerFunc {
return func(c *gin.Context) {
if _, err := c.Cookie("csrf_token"); err != nil {
c.SetCookie("csrf_token", uuid.NewString(), 3600, "/", "", true, false)
}
c.Next()
}
}

func CSRFProtection(enabled bool) gin.HandlerFunc {
return func(c *gin.Context) {
if !enabled || c.Request.Method == http.MethodGet || c.Request.Method == http.MethodHead || c.Request.Method == http.MethodOptions {
c.Next()
return
}
origin := c.GetHeader("Origin")
host := c.Request.Host
if origin != "" && !strings.Contains(origin, host) {
c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "invalid origin"})
return
}
cookieToken, err := c.Cookie("csrf_token")
if err != nil {
c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "missing csrf cookie"})
return
}
headerToken := c.GetHeader("X-CSRF-Token")
if headerToken == "" || headerToken != cookieToken {
c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "invalid csrf token"})
return
}
c.Next()
}
}
