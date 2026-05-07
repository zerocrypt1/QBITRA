package queue

import "encoding/json"

type EmailPayload struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	HTMLBody string `json:"html_body"`
}

type SubmissionPayload struct {
	SubmissionID string `json:"submission_id"`
	Code         string `json:"code"`
	Language     string `json:"language"`
}

func MustJSON(v any) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return b
}
