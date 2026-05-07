package models

type Notification struct {
	BaseModel `bson:",inline"`
	UserID    string `bson:"user_id" json:"user_id"`
	Type      string `bson:"type" json:"type"`
	Title     string `bson:"title" json:"title"`
	Body      string `bson:"body" json:"body"`
	Read      bool   `bson:"read" json:"read"`
}
