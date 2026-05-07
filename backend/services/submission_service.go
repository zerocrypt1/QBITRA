package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/zerocrypt1/QBITRA/backend/dto"
	"github.com/zerocrypt1/QBITRA/backend/models"
	"github.com/zerocrypt1/QBITRA/backend/queue"
	"github.com/zerocrypt1/QBITRA/backend/repositories"
)

type SubmissionService interface {
	Submit(ctx context.Context, req dto.SubmitCodeRequest, userID string) (*models.Submission, error)
	ListMine(ctx context.Context, userID string, limit, offset int64) ([]models.Submission, error)
}

type submissionService struct {
	repo  repositories.SubmissionRepository
	queue *queue.Producer
}

func NewSubmissionService(repo repositories.SubmissionRepository, queue *queue.Producer) SubmissionService {
	return &submissionService{repo: repo, queue: queue}
}

func (s *submissionService) Submit(ctx context.Context, req dto.SubmitCodeRequest, userID string) (*models.Submission, error) {
	sub := &models.Submission{
		UserID:         userID,
		ProblemID:      req.ProblemID,
		Language:       req.Language,
		Code:           req.Code,
		Verdict:        "Pending",
		ContestID:      req.ContestID,
		ExecutionToken: uuid.NewString(),
	}
	if err := s.repo.Create(ctx, sub); err != nil {
		return nil, err
	}
	_ = s.queue.EnqueueSubmission(ctx, queue.SubmissionPayload{SubmissionID: sub.ID.Hex(), Code: sub.Code, Language: sub.Language})
	return sub, nil
}

func (s *submissionService) ListMine(ctx context.Context, userID string, limit, offset int64) ([]models.Submission, error) {
	return s.repo.ListByUser(ctx, userID, limit, offset)
}
