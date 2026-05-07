package routes

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/zerocrypt1/QBITRA/backend/constants"
	"github.com/zerocrypt1/QBITRA/backend/controllers"
	"github.com/zerocrypt1/QBITRA/backend/middleware"
	"github.com/zerocrypt1/QBITRA/backend/websocket"
)

type Deps struct {
	Redis          *redis.Client
	JWTSecret      string
	CSRFEnabled    bool
	AllowedOrigins []string
	Auth           *controllers.AuthController
	Users          *controllers.UserController
	Problems       *controllers.ProblemController
	Submissions    *controllers.SubmissionController
	Contests       *controllers.ContestController
	Comments       *controllers.CommentController
	WSHub          *websocket.Hub
}

func Register(r *gin.Engine, deps Deps) {
	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })
	r.GET("/ws", deps.WSHub.Handle)

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/signup", deps.Auth.Signup)
			auth.POST("/login", deps.Auth.Login)
			auth.POST("/refresh", deps.Auth.Refresh)
			auth.POST("/logout", deps.Auth.Logout)
			auth.POST("/otp/send", deps.Auth.SendOTP)
			auth.POST("/otp/verify", deps.Auth.VerifyOTP)
		}

		problems := api.Group("/problems")
		{
			problems.GET("", deps.Problems.List)
			problems.GET("/:id", deps.Problems.Get)
			problemsAuth := problems.Group("")
			problemsAuth.Use(middleware.JWT(deps.JWTSecret), middleware.RBAC(constants.RoleAdmin, constants.RoleModerator))
			problemsAuth.POST("", deps.Problems.Create)
		}

		protected := api.Group("")
		protected.Use(
			middleware.JWT(deps.JWTSecret),
			middleware.CSRFProtection(deps.CSRFEnabled),
			middleware.RateLimit(deps.Redis, time.Minute, 120),
		)
		{
			users := protected.Group("/users")
			users.GET("/me", deps.Users.Me)
			users.POST("/avatar", deps.Users.UploadAvatar)

			submissions := protected.Group("/submissions")
			submissions.POST("", deps.Submissions.Submit)
			submissions.GET("/mine", deps.Submissions.Mine)

			contests := protected.Group("/contests")
			contests.GET("", deps.Contests.List)
			contests.POST("", deps.Contests.Create)
			contests.POST("/:id/register", deps.Contests.Register)

			comments := protected.Group("/comments")
			comments.GET("", deps.Comments.List)
			comments.POST("", deps.Comments.Create)
			comments.POST("/:id/like", deps.Comments.Like)
		}

		admin := api.Group("/admin")
		admin.Use(middleware.JWT(deps.JWTSecret), middleware.RBAC(constants.RoleAdmin))
		admin.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })
	}
}
