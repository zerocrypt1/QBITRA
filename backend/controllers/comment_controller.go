package controllers

import "github.com/gin-gonic/gin"

type CommentController struct{}

func NewCommentController() *CommentController { return &CommentController{} }

func (cc *CommentController) List(c *gin.Context)   { c.JSON(200, gin.H{"items": []any{}}) }
func (cc *CommentController) Create(c *gin.Context) { c.JSON(201, gin.H{"message": "comment created"}) }
func (cc *CommentController) Like(c *gin.Context)   { c.JSON(200, gin.H{"message": "liked"}) }
