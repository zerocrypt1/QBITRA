package middleware

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
)

func RBAC(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		rawRole, ok := c.Get(ContextRole)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		role, ok := rawRole.(string)
		if !ok || !slices.Contains(roles, role) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
			return
		}
		c.Next()
	}
}
