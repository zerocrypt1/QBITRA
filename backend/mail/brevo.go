package mail

import (
"bytes"
"context"
"encoding/json"
"fmt"
"net/http"
"time"
)

type Service struct {
apiKey      string
senderEmail string
senderName  string
httpClient  *http.Client
}

func NewService(apiKey, senderEmail, senderName string) *Service {
return &Service{
apiKey:      apiKey,
senderEmail: senderEmail,
senderName:  senderName,
httpClient:  &http.Client{Timeout: 10 * time.Second},
}
}

func (s *Service) Send(ctx context.Context, to, subject, htmlBody string) error {
payload := map[string]any{
"sender": map[string]string{"name": s.senderName, "email": s.senderEmail},
"to":     []map[string]string{{"email": to}},
"subject": subject,
"htmlContent": htmlBody,
}
body, _ := json.Marshal(payload)
req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.brevo.com/v3/smtp/email", bytes.NewReader(body))
if err != nil {
return err
}
req.Header.Set("Content-Type", "application/json")
req.Header.Set("api-key", s.apiKey)
resp, err := s.httpClient.Do(req)
if err != nil {
return err
}
defer resp.Body.Close()
if resp.StatusCode >= 300 {
return fmt.Errorf("brevo send failed with status %d", resp.StatusCode)
}
return nil
}
