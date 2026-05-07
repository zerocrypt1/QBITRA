package repositories

import (
"context"
"time"

"github.com/zerocrypt1/QBITRA/backend/models"
"go.mongodb.org/mongo-driver/v2/bson"
"go.mongodb.org/mongo-driver/v2/mongo"
)

type SessionRepository interface {
Create(ctx context.Context, s *models.Session) error
FindByRefreshJTI(ctx context.Context, jti string) (*models.Session, error)
RevokeByRefreshJTI(ctx context.Context, jti string) error
}

type sessionRepository struct {
col *mongo.Collection
}

func NewSessionRepository(db *mongo.Database) SessionRepository {
return &sessionRepository{col: db.Collection("sessions")}
}

func (r *sessionRepository) Create(ctx context.Context, s *models.Session) error {
now := time.Now().UTC()
s.CreatedAt = now
s.UpdatedAt = now
_, err := r.col.InsertOne(ctx, s)
return err
}

func (r *sessionRepository) FindByRefreshJTI(ctx context.Context, jti string) (*models.Session, error) {
var s models.Session
if err := r.col.FindOne(ctx, bson.M{"refresh_jti": jti}).Decode(&s); err != nil {
return nil, err
}
return &s, nil
}

func (r *sessionRepository) RevokeByRefreshJTI(ctx context.Context, jti string) error {
_, err := r.col.UpdateOne(ctx, bson.M{"refresh_jti": jti}, bson.M{"$set": bson.M{"revoked_at": time.Now().UTC(), "updated_at": time.Now().UTC()}})
return err
}
