package services

import (
"context"
"strings"

"github.com/gosimple/slug"
"github.com/zerocrypt1/QBITRA/backend/dto"
"github.com/zerocrypt1/QBITRA/backend/models"
"github.com/zerocrypt1/QBITRA/backend/repositories"
"github.com/zerocrypt1/QBITRA/backend/utils"
)

type ProblemService interface {
Create(ctx context.Context, req dto.ProblemCreateRequest, authorID string) error
List(ctx context.Context, limit, offset int64, publicOnly bool) ([]models.Problem, error)
}

type problemService struct {
repo repositories.ProblemRepository
}

func NewProblemService(repo repositories.ProblemRepository) ProblemService {
return &problemService{repo: repo}
}

func (s *problemService) Create(ctx context.Context, req dto.ProblemCreateRequest, authorID string) error {
p := &models.Problem{
Title:      utils.SanitizeHTML(req.Title),
Slug:       slug.Make(strings.ToLower(req.Title)),
Statement:  utils.SanitizeHTML(req.Statement),
Difficulty: req.Difficulty,
Tags:       req.Tags,
Editorial:  utils.SanitizeHTML(req.Editorial),
IsPublic:   req.IsPublic,
AuthorID:   authorID,
}
return s.repo.Create(ctx, p)
}

func (s *problemService) List(ctx context.Context, limit, offset int64, publicOnly bool) ([]models.Problem, error) {
return s.repo.List(ctx, limit, offset, publicOnly)
}
