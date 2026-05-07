package repositories

import (
	"context"
	"time"

	"github.com/zerocrypt1/QBITRA/backend/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type SubmissionRepository interface {
	Create(ctx context.Context, s *models.Submission) error
	UpdateVerdict(ctx context.Context, id, verdict string, runtimeMS, memoryKB int) error
	ListByUser(ctx context.Context, userID string, limit, offset int64) ([]models.Submission, error)
}

type submissionRepository struct {
	col *mongo.Collection
}

func NewSubmissionRepository(db *mongo.Database) SubmissionRepository {
	return &submissionRepository{col: db.Collection("submissions")}
}

func (r *submissionRepository) Create(ctx context.Context, s *models.Submission) error {
	now := time.Now().UTC()
	s.CreatedAt = now
	s.UpdatedAt = now
	_, err := r.col.InsertOne(ctx, s)
	return err
}

func (r *submissionRepository) UpdateVerdict(ctx context.Context, id, verdict string, runtimeMS, memoryKB int) error {
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.col.UpdateByID(ctx, oid, bson.M{"$set": bson.M{
		"verdict":    verdict,
		"runtime_ms": runtimeMS,
		"memory_kb":  memoryKB,
		"updated_at": time.Now().UTC(),
	}})
	return err
}

func (r *submissionRepository) ListByUser(ctx context.Context, userID string, limit, offset int64) ([]models.Submission, error) {
	if err := validateSafeID(userID); err != nil {
		return nil, err
	}
	cur, err := r.col.Find(ctx, bson.D{{Key: "user_id", Value: userID}}, options.Find().SetLimit(limit).SetSkip(offset).SetSort(bson.M{"created_at": -1}))
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	out := []models.Submission{}
	if err := cur.All(ctx, &out); err != nil {
		return nil, err
	}
	return out, nil
}
