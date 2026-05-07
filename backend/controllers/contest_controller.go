package controllers

import "github.com/gin-gonic/gin"

type ContestController struct{}

func NewContestController() *ContestController { return &ContestController{} }

func (cc *ContestController) List(c *gin.Context) { c.JSON(200, gin.H{"items": []any{}}) }
func (cc *ContestController) Create(c *gin.Context) { c.JSON(201, gin.H{"message": "contest created"}) }
func (cc *ContestController) Register(c *gin.Context) { c.JSON(200, gin.H{"message": "registered"}) }
