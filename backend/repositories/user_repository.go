package repositories

import (
"context"
"time"

"github.com/zerocrypt1/QBITRA/backend/models"
"go.mongodb.org/mongo-driver/v2/bson"
"go.mongodb.org/mongo-driver/v2/mongo"
"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type UserRepository interface {
Create(ctx context.Context, u *models.User) error
FindByEmail(ctx context.Context, email string) (*models.User, error)
FindByID(ctx context.Context, id bson.ObjectID) (*models.User, error)
UpdateByID(ctx context.Context, id bson.ObjectID, update bson.M) error
}

type userRepository struct {
col *mongo.Collection
}

func NewUserRepository(db *mongo.Database) UserRepository {
return &userRepository{col: db.Collection("users")}
}

func (r *userRepository) Create(ctx context.Context, u *models.User) error {
now := time.Now().UTC()
u.CreatedAt = now
u.UpdatedAt = now
_, err := r.col.InsertOne(ctx, u)
return err
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
var u models.User
err := r.col.FindOne(ctx, bson.M{"email": email}).Decode(&u)
if err != nil {
return nil, err
}
return &u, nil
}

func (r *userRepository) FindByID(ctx context.Context, id bson.ObjectID) (*models.User, error) {
var u models.User
err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&u)
if err != nil {
return nil, err
}
return &u, nil
}

func (r *userRepository) UpdateByID(ctx context.Context, id bson.ObjectID, update bson.M) error {
update["updated_at"] = time.Now().UTC()
_, err := r.col.UpdateByID(ctx, id, bson.M{"$set": update}, options.UpdateOne())
return err
}
