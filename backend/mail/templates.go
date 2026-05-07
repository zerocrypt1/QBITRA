package mail

import "fmt"

func VerificationTemplate(link string) string {
return fmt.Sprintf("<h1>Verify your QBITRA account</h1><p>Click <a href=\"%s\">here</a> to verify.</p>", link)
}

func PasswordResetTemplate(link string) string {
return fmt.Sprintf("<h1>Password Reset</h1><p>Reset your password: <a href=\"%s\">Reset</a></p>", link)
}

func OTPTemplate(otp string) string {
return fmt.Sprintf("<h1>Your OTP</h1><p><strong>%s</strong></p>", otp)
}

func WelcomeTemplate(username string) string {
return fmt.Sprintf("<h1>Welcome, %s!</h1><p>Glad to have you on QBITRA.</p>", username)
}
