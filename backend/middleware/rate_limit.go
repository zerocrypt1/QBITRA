package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func RateLimit(rdb *redis.Client, window time.Duration, maxReq int64) gin.HandlerFunc {
	script := redis.NewScript(`
local c = redis.call('INCR', KEYS[1])
if c == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return c
`)
	return func(c *gin.Context) {
		ctx := context.Background()
		key := fmt.Sprintf("rl:%s:%s", c.ClientIP(), c.FullPath())
		res, err := script.Run(ctx, rdb, []string{key}, strconv.FormatInt(int64(window.Seconds()), 10)).Int64()
		if err != nil {
			c.Next()
			return
		}
		if res > maxReq {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded"})
			return
		}
		c.Next()
	}
}
