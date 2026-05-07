package models

import "go.mongodb.org/mongo-driver/v2/bson"

type User struct {
	BaseModel       `bson:",inline"`
	Email           string          `bson:"email" json:"email"`
	Username        string          `bson:"username" json:"username"`
	PasswordHash    string          `bson:"password_hash" json:"-"`
	Role            string          `bson:"role" json:"role"`
	EmailVerified   bool            `bson:"email_verified" json:"email_verified"`
	AvatarKey       string          `bson:"avatar_key,omitempty" json:"avatar_key,omitempty"`
	Rating          int             `bson:"rating" json:"rating"`
	SolvedProblems  []bson.ObjectID `bson:"solved_problems,omitempty" json:"solved_problems,omitempty"`
	FailedLogins    int             `bson:"failed_logins" json:"-"`
	LockedUntilUnix int64           `bson:"locked_until_unix" json:"-"`
}
