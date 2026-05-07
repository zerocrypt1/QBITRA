package middleware

import (
"context"
"fmt"
"net/http"
"time"

"github.com/gin-gonic/gin"
"github.com/redis/go-redis/v9"
)

func RateLimit(rdb *redis.Client, window time.Duration, maxReq int64) gin.HandlerFunc {
return func(c *gin.Context) {
ctx := context.Background()
key := fmt.Sprintf("rl:%s:%s", c.ClientIP(), c.FullPath())
count, err := rdb.Incr(ctx, key).Result()
if err == nil && count == 1 {
_ = rdb.Expire(ctx, key, window).Err()
}
if err != nil {
c.Next()
return
}
if count > maxReq {
c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded"})
return
}
c.Next()
}
}
