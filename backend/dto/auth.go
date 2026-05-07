package dto

type SignupRequest struct {
Email    string `json:"email" binding:"required,email,max=254"`
Username string `json:"username" binding:"required,min=3,max=32,alphanum"`
Password string `json:"password" binding:"required,min=12,max=128"`
}

type LoginRequest struct {
Email    string `json:"email" binding:"required,email,max=254"`
Password string `json:"password" binding:"required,min=12,max=128"`
}

type RefreshRequest struct {
RefreshToken string `json:"refresh_token" binding:"required"`
}

type VerifyEmailRequest struct {
Token string `json:"token" binding:"required"`
}

type ForgotPasswordRequest struct {
Email string `json:"email" binding:"required,email,max=254"`
}

type ResetPasswordRequest struct {
Token       string `json:"token" binding:"required"`
NewPassword string `json:"new_password" binding:"required,min=12,max=128"`
}

type VerifyOTPRequest struct {
Email string `json:"email" binding:"required,email"`
OTP   string `json:"otp" binding:"required,len=6,numeric"`
}
