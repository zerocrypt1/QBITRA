package models

import "time"

type Session struct {
	BaseModel     `bson:",inline"`
	UserID        string    `bson:"user_id" json:"user_id"`
	RefreshJTI    string    `bson:"refresh_jti" json:"refresh_jti"`
	UserAgentHash string    `bson:"user_agent_hash" json:"-"`
	IPHash        string    `bson:"ip_hash" json:"-"`
	ExpiresAt     time.Time `bson:"expires_at" json:"expires_at"`
	RevokedAt     time.Time `bson:"revoked_at,omitempty" json:"revoked_at,omitempty"`
}
