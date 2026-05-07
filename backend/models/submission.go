package models

type Submission struct {
BaseModel      `bson:",inline"`
UserID         string `bson:"user_id" json:"user_id"`
ProblemID      string `bson:"problem_id" json:"problem_id"`
Language       string `bson:"language" json:"language"`
Code           string `bson:"code" json:"code"`
Verdict        string `bson:"verdict" json:"verdict"`
RuntimeMS      int    `bson:"runtime_ms" json:"runtime_ms"`
MemoryKB       int    `bson:"memory_kb" json:"memory_kb"`
ContestID      string `bson:"contest_id,omitempty" json:"contest_id,omitempty"`
ExecutionToken string `bson:"execution_token" json:"execution_token"`
}
