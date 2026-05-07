package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zerocrypt1/QBITRA/backend/dto"
	"github.com/zerocrypt1/QBITRA/backend/middleware"
	"github.com/zerocrypt1/QBITRA/backend/services"
)

type ProblemController struct {
	svc services.ProblemService
}

func NewProblemController(svc services.ProblemService) *ProblemController {
	return &ProblemController{svc: svc}
}

func (p *ProblemController) Create(c *gin.Context) {
	var req dto.ProblemCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid := c.GetString(middleware.ContextUserID)
	if err := p.svc.Create(c.Request.Context(), req, uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "problem created"})
}

func (p *ProblemController) List(c *gin.Context) {
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "20"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)
	publicOnly := c.Query("public") != "false"
	items, err := p.svc.List(c.Request.Context(), limit, offset, publicOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list problems"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "limit": limit, "offset": offset})
}

func (p *ProblemController) Get(c *gin.Context) {
	id := c.Param("id")
	item, err := p.svc.Get(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("problem with id %s not found", id)})
		return
	}
	c.JSON(http.StatusOK, item)
}
