package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func NewMongoClient(ctx context.Context, uri string) (*mongo.Client, error) {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}
	ctxPing, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := client.Ping(ctxPing, nil); err != nil {
		return nil, err
	}
	return client, nil
}

func EnsureIndexes(ctx context.Context, db *mongo.Database) error {
	_, err := db.Collection("users").Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: map[string]int{"email": 1}, Options: options.Index().SetUnique(true)},
		{Keys: map[string]int{"username": 1}, Options: options.Index().SetUnique(true)},
	})
	if err != nil {
		return err
	}
	_, err = db.Collection("problems").Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: map[string]int{"slug": 1}, Options: options.Index().SetUnique(true)},
		{Keys: map[string]int{"difficulty": 1}},
		{Keys: map[string]int{"tags": 1}},
	})
	if err != nil {
		return err
	}
	_, err = db.Collection("submissions").Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: map[string]int{"user_id": 1, "problem_id": 1, "created_at": -1}},
		{Keys: map[string]int{"contest_id": 1, "created_at": -1}},
	})
	if err != nil {
		return err
	}
	_, err = db.Collection("sessions").Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: map[string]int{"refresh_jti": 1}, Options: options.Index().SetUnique(true)},
		{Keys: map[string]int{"expires_at": 1}, Options: options.Index().SetExpireAfterSeconds(0)},
	})
	return err
}
