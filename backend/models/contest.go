package models

import "time"

type Contest struct {
BaseModel      `bson:",inline"`
Title          string    `bson:"title" json:"title"`
Description    string    `bson:"description" json:"description"`
StartTime      time.Time `bson:"start_time" json:"start_time"`
EndTime        time.Time `bson:"end_time" json:"end_time"`
ProblemIDs     []string  `bson:"problem_ids" json:"problem_ids"`
Registrations  []string  `bson:"registrations" json:"registrations"`
IsRegistration bool      `bson:"is_registration" json:"is_registration"`
}
