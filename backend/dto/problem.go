package dto

type ProblemCreateRequest struct {
Title      string   `json:"title" binding:"required,min=3,max=160"`
Statement  string   `json:"statement" binding:"required,min=10,max=50000"`
Difficulty string   `json:"difficulty" binding:"required,oneof=easy medium hard"`
Tags       []string `json:"tags" binding:"max=15"`
Editorial  string   `json:"editorial" binding:"max=50000"`
IsPublic   bool     `json:"is_public"`
}
