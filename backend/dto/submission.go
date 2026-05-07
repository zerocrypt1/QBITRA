package dto

type SubmitCodeRequest struct {
	ProblemID string `json:"problem_id" binding:"required"`
	Language  string `json:"language" binding:"required,oneof=go cpp java python javascript rust"`
	Code      string `json:"code" binding:"required,min=1,max=200000"`
	ContestID string `json:"contest_id"`
}
