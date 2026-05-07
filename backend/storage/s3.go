package storage

import (
	"context"
	cryptorand "crypto/rand"
	"fmt"
	"io"
	"math/big"
	"path/filepath"
	"strings"
	"time"

	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type S3Storage struct {
	client *s3.Client
	bucket string
}

func NewS3Storage(ctx context.Context, region, bucket, accessKey, secretKey string) (*S3Storage, error) {
	cfg, err := awsconfig.LoadDefaultConfig(ctx,
		awsconfig.WithRegion(region),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	)
	if err != nil {
		return nil, err
	}
	return &S3Storage{client: s3.NewFromConfig(cfg), bucket: bucket}, nil
}

func (s *S3Storage) UploadAvatar(ctx context.Context, file io.Reader, fileName, mimeType string, size int64) (string, error) {
	if size > 5*1024*1024 {
		return "", fmt.Errorf("file too large")
	}
	allowed := map[string]bool{"image/png": true, "image/jpeg": true, "image/webp": true}
	if !allowed[mimeType] {
		return "", fmt.Errorf("unsupported mime type")
	}
	ext := filepath.Ext(strings.ToLower(fileName))
	rn, err := cryptorand.Int(cryptorand.Reader, big.NewInt(99999999))
	if err != nil {
		return "", err
	}
	key := fmt.Sprintf("avatars/%d-%08d%s", time.Now().Unix(), rn.Int64(), ext)
	_, err = s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:               &s.bucket,
		Key:                  &key,
		Body:                 file,
		ContentType:          &mimeType,
		ServerSideEncryption: types.ServerSideEncryptionAes256,
		ACL:                  types.ObjectCannedACLPrivate,
	})
	if err != nil {
		return "", err
	}
	return key, nil
}

func (s *S3Storage) SignedGetURL(ctx context.Context, key string, validFor time.Duration) (string, error) {
	presigner := s3.NewPresignClient(s.client)
	resp, err := presigner.PresignGetObject(ctx, &s3.GetObjectInput{Bucket: &s.bucket, Key: &key}, func(o *s3.PresignOptions) {
		o.Expires = validFor
	})
	if err != nil {
		return "", err
	}
	return resp.URL, nil
}

func (s *S3Storage) Delete(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{Bucket: &s.bucket, Key: &key})
	return err
}
