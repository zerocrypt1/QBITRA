package queue

import (
"context"
"time"

"github.com/hibiken/asynq"
"github.com/zerocrypt1/QBITRA/backend/constants"
)

type Producer struct {
client *asynq.Client
}

func NewProducer(redisAddr, redisPassword string, redisDB int) *Producer {
return &Producer{client: asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr, Password: redisPassword, DB: redisDB})}
}

func (p *Producer) EnqueueEmail(ctx context.Context, payload EmailPayload) error {
task := asynq.NewTask(constants.TaskSendEmail, MustJSON(payload))
_, err := p.client.EnqueueContext(ctx, task,
asynq.Queue(constants.QueueDefault),
asynq.MaxRetry(10),
asynq.Timeout(30*time.Second),
)
return err
}

func (p *Producer) EnqueueSubmission(ctx context.Context, payload SubmissionPayload) error {
task := asynq.NewTask(constants.TaskProcessSubmission, MustJSON(payload))
_, err := p.client.EnqueueContext(ctx, task,
asynq.Queue(constants.QueueCritical),
asynq.MaxRetry(5),
asynq.Timeout(40*time.Second),
)
return err
}

func (p *Producer) Close() error { return p.client.Close() }
