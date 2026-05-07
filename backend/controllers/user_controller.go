package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zerocrypt1/QBITRA/backend/middleware"
	"github.com/zerocrypt1/QBITRA/backend/storage"
)

type UserController struct {
	s3 *storage.S3Storage
}

func NewUserController(s3 *storage.S3Storage) *UserController {
	return &UserController{s3: s3}
}

func (u *UserController) Me(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"user_id": c.GetString(middleware.ContextUserID), "role": c.GetString(middleware.ContextRole)})
}

func (u *UserController) UploadAvatar(c *gin.Context) {
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing file"})
		return
	}
	opened, err := file.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file"})
		return
	}
	defer opened.Close()
	key, err := u.s3.UploadAvatar(c.Request.Context(), opened, file.Filename, file.Header.Get("Content-Type"), file.Size)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	url, _ := u.s3.SignedGetURL(c.Request.Context(), key, 15*time.Minute)
	c.JSON(http.StatusOK, gin.H{"key": key, "url": url})
}
