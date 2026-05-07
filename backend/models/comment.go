package models

type Comment struct {
	BaseModel    `bson:",inline"`
	TargetType   string   `bson:"target_type" json:"target_type"`
	TargetID     string   `bson:"target_id" json:"target_id"`
	UserID       string   `bson:"user_id" json:"user_id"`
	Body         string   `bson:"body" json:"body"`
	ParentID     string   `bson:"parent_id,omitempty" json:"parent_id,omitempty"`
	LikedBy      []string `bson:"liked_by" json:"liked_by"`
	RepliesCount int      `bson:"replies_count" json:"replies_count"`
}
