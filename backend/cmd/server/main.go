package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/zerocrypt1/QBITRA/backend/config"
	"github.com/zerocrypt1/QBITRA/backend/controllers"
	"github.com/zerocrypt1/QBITRA/backend/logger"
	"github.com/zerocrypt1/QBITRA/backend/mail"
	"github.com/zerocrypt1/QBITRA/backend/middleware"
	"github.com/zerocrypt1/QBITRA/backend/queue"
	"github.com/zerocrypt1/QBITRA/backend/repositories"
	"github.com/zerocrypt1/QBITRA/backend/routes"
	"github.com/zerocrypt1/QBITRA/backend/services"
	"github.com/zerocrypt1/QBITRA/backend/storage"
	"github.com/zerocrypt1/QBITRA/backend/websocket"
	"github.com/zerocrypt1/QBITRA/backend/workers"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	logg := logger.New(cfg.AppEnv)

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	mongoClient, err := repositories.NewMongoClient(ctx, cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	db := mongoClient.Database(cfg.MongoDBName)
	if err := repositories.EnsureIndexes(ctx, db); err != nil {
		log.Fatal(err)
	}

	rdb := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr, Password: cfg.RedisPassword, DB: cfg.RedisDB})
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Fatal(err)
	}

	mailSvc := mail.NewService(cfg.BrevoAPIKey, cfg.BrevoSenderEmail, cfg.BrevoSenderName)
	s3Svc, err := storage.NewS3Storage(ctx, cfg.S3Region, cfg.S3Bucket, cfg.S3AccessKeyID, cfg.S3SecretAccessKey)
	if err != nil {
		log.Fatal(err)
	}
	producer := queue.NewProducer(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB)
	defer producer.Close()

	userRepo := repositories.NewUserRepository(db)
	sessionRepo := repositories.NewSessionRepository(db)
	problemRepo := repositories.NewProblemRepository(db)
	submissionRepo := repositories.NewSubmissionRepository(db)

	authSvc := services.NewAuthService(cfg, userRepo, sessionRepo, rdb, logg)
	problemSvc := services.NewProblemService(problemRepo)
	submissionSvc := services.NewSubmissionService(submissionRepo, producer)

	authCtrl := controllers.NewAuthController(cfg, authSvc, producer)
	userCtrl := controllers.NewUserController(s3Svc)
	problemCtrl := controllers.NewProblemController(problemSvc)
	submissionCtrl := controllers.NewSubmissionController(submissionSvc)
	contestCtrl := controllers.NewContestController()
	commentCtrl := controllers.NewCommentController()
	wsHub := websocket.NewHub()

	if os.Getenv("RUN_WORKERS") == "true" {
		worker := workers.New(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB, cfg.AsynqConcurrency, mailSvc, submissionRepo, logg)
		log.Fatal(worker.Run())
		return
	}

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	if len(cfg.TrustedProxyCIDRs) > 0 {
		_ = r.SetTrustedProxies(cfg.TrustedProxyCIDRs)
	}
	r.Use(
		middleware.Recovery(logg),
		middleware.RequestID(),
		middleware.Logging(logg),
		middleware.SecurityHeaders(),
		middleware.CORS(cfg.AllowedOrigins),
		middleware.CSRFCookie(),
		middleware.BodyLimit(2*1024*1024),
	)

	routes.Register(r, routes.Deps{
		Redis:          rdb,
		JWTSecret:      cfg.JWTAccessSecret,
		CSRFEnabled:    cfg.CSRFEnabled,
		AllowedOrigins: cfg.AllowedOrigins,
		Auth:           authCtrl,
		Users:          userCtrl,
		Problems:       problemCtrl,
		Submissions:    submissionCtrl,
		Contests:       contestCtrl,
		Comments:       commentCtrl,
		WSHub:          wsHub,
	})

	logg.Info("server_start", "addr", cfg.Addr())
	if err := r.Run(cfg.Addr()); err != nil {
		log.Fatal(err)
	}
}
