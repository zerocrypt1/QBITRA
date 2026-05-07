package repositories

import (
	"context"
	"time"

	"github.com/zerocrypt1/QBITRA/backend/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type ProblemRepository interface {
	Create(ctx context.Context, p *models.Problem) error
	List(ctx context.Context, limit, offset int64, publicOnly bool) ([]models.Problem, error)
	FindByID(ctx context.Context, id string) (*models.Problem, error)
}

type problemRepository struct {
	col *mongo.Collection
}

func NewProblemRepository(db *mongo.Database) ProblemRepository {
	return &problemRepository{col: db.Collection("problems")}
}

func (r *problemRepository) Create(ctx context.Context, p *models.Problem) error {
	now := time.Now().UTC()
	p.CreatedAt = now
	p.UpdatedAt = now
	_, err := r.col.InsertOne(ctx, p)
	return err
}

func (r *problemRepository) List(ctx context.Context, limit, offset int64, publicOnly bool) ([]models.Problem, error) {
	filter := bson.M{}
	if publicOnly {
		filter["is_public"] = true
	}
	cur, err := r.col.Find(ctx, filter, options.Find().SetLimit(limit).SetSkip(offset).SetSort(bson.M{"created_at": -1}))
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	out := []models.Problem{}
	if err := cur.All(ctx, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func (r *problemRepository) FindByID(ctx context.Context, id string) (*models.Problem, error) {
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var p models.Problem
	if err := r.col.FindOne(ctx, bson.M{"_id": oid}).Decode(&p); err != nil {
		return nil, err
	}
	return &p, nil
}
