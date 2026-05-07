package controllers

import (
"net/http"

"github.com/gin-gonic/gin"
"github.com/zerocrypt1/QBITRA/backend/config"
"github.com/zerocrypt1/QBITRA/backend/dto"
"github.com/zerocrypt1/QBITRA/backend/mail"
"github.com/zerocrypt1/QBITRA/backend/queue"
"github.com/zerocrypt1/QBITRA/backend/services"
)

type AuthController struct {
cfg     *config.Config
auth    services.AuthService
producer *queue.Producer
}

func NewAuthController(cfg *config.Config, auth services.AuthService, producer *queue.Producer) *AuthController {
return &AuthController{cfg: cfg, auth: auth, producer: producer}
}

func (a *AuthController) Signup(c *gin.Context) {
var req dto.SignupRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
u, at, rt, err := a.auth.Signup(c.Request.Context(), req.Email, req.Username, req.Password, c.ClientIP(), c.GetHeader("User-Agent"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
_ = a.producer.EnqueueEmail(c.Request.Context(), queue.EmailPayload{
To: u.Email, Subject: "Welcome to QBITRA", HTMLBody: mail.WelcomeTemplate(u.Username),
})
setRefreshCookie(c, rt, a.cfg)
c.JSON(http.StatusCreated, gin.H{"user": u, "access_token": at})
}

func (a *AuthController) Login(c *gin.Context) {
var req dto.LoginRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
u, at, rt, err := a.auth.Login(c.Request.Context(), req.Email, req.Password, c.ClientIP(), c.GetHeader("User-Agent"))
if err != nil {
c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
return
}
setRefreshCookie(c, rt, a.cfg)
c.JSON(http.StatusOK, gin.H{"user": u, "access_token": at})
}

func (a *AuthController) Refresh(c *gin.Context) {
refresh, _ := c.Cookie("refresh_token")
if refresh == "" {
var req dto.RefreshRequest
if err := c.ShouldBindJSON(&req); err == nil {
refresh = req.RefreshToken
}
}
at, rt, err := a.auth.RotateTokens(c.Request.Context(), refresh, c.ClientIP(), c.GetHeader("User-Agent"))
if err != nil {
c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
return
}
setRefreshCookie(c, rt, a.cfg)
c.JSON(http.StatusOK, gin.H{"access_token": at})
}

func (a *AuthController) Logout(c *gin.Context) {
refresh, _ := c.Cookie("refresh_token")
_ = a.auth.Logout(c.Request.Context(), refresh)
c.SetCookie("refresh_token", "", -1, "/", "", a.cfg.CookieSecure, true)
c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

func (a *AuthController) SendOTP(c *gin.Context) {
var req dto.ForgotPasswordRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
otp, err := a.auth.GenerateOTP(c.Request.Context(), req.Email)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate otp"})
return
}
_ = a.producer.EnqueueEmail(c.Request.Context(), queue.EmailPayload{To: req.Email, Subject: "QBITRA OTP", HTMLBody: mail.OTPTemplate(otp)})
c.JSON(http.StatusOK, gin.H{"message": "otp sent"})
}

func (a *AuthController) VerifyOTP(c *gin.Context) {
var req dto.VerifyOTPRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
if err := a.auth.VerifyOTP(c.Request.Context(), req.Email, req.OTP); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, gin.H{"message": "otp verified"})
}

func setRefreshCookie(c *gin.Context, token string, cfg *config.Config) {
c.SetSameSite(http.SameSiteStrictMode)
c.SetCookie("refresh_token", token, int(cfg.JWTRefreshTTL.Seconds()), "/", "", cfg.CookieSecure, true)
}
