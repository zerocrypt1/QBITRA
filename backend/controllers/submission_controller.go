package controllers

import (
"net/http"
"strconv"

"github.com/gin-gonic/gin"
"github.com/zerocrypt1/QBITRA/backend/dto"
"github.com/zerocrypt1/QBITRA/backend/middleware"
"github.com/zerocrypt1/QBITRA/backend/services"
)

type SubmissionController struct {
svc services.SubmissionService
}

func NewSubmissionController(svc services.SubmissionService) *SubmissionController {
return &SubmissionController{svc: svc}
}

func (s *SubmissionController) Submit(c *gin.Context) {
var req dto.SubmitCodeRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
uid := c.GetString(middleware.ContextUserID)
sub, err := s.svc.Submit(c.Request.Context(), req, uid)
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusAccepted, gin.H{"submission": sub})
}

func (s *SubmissionController) Mine(c *gin.Context) {
uid := c.GetString(middleware.ContextUserID)
limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "20"), 10, 64)
offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)
items, err := s.svc.ListMine(c.Request.Context(), uid, limit, offset)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list submissions"})
return
}
c.JSON(http.StatusOK, gin.H{"items": items})
}
