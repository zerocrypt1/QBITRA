package workers

import (
"encoding/json"
"log/slog"
"math/rand"
"time"

"github.com/hibiken/asynq"
"github.com/zerocrypt1/QBITRA/backend/constants"
"github.com/zerocrypt1/QBITRA/backend/mail"
"github.com/zerocrypt1/QBITRA/backend/queue"
"github.com/zerocrypt1/QBITRA/backend/repositories"
)

type WorkerServer struct {
server      *asynq.Server
mailService *mail.Service
submissions repositories.SubmissionRepository
logger      *slog.Logger
}

func New(redisAddr, redisPassword string, redisDB, concurrency int, mailService *mail.Service, submissions repositories.SubmissionRepository, logger *slog.Logger) *WorkerServer {
return &WorkerServer{
server: asynq.NewServer(asynq.RedisClientOpt{Addr: redisAddr, Password: redisPassword, DB: redisDB}, asynq.Config{
Concurrency: concurrency,
Queues: map[string]int{
constants.QueueCritical: 10,
constants.QueueDefault:  6,
constants.QueueLow:      2,
},
}),
mailService: mailService,
submissions: submissions,
logger:      logger,
}
}

func (w *WorkerServer) Run() error {
mux := asynq.NewServeMux()
mux.HandleFunc(constants.TaskSendEmail, w.handleSendEmail)
mux.HandleFunc(constants.TaskProcessSubmission, w.handleProcessSubmission)
return w.server.Run(mux)
}

func (w *WorkerServer) handleSendEmail(_ context.Context, t *asynq.Task) error {
var p queue.EmailPayload
if err := json.Unmarshal(t.Payload(), &p); err != nil {
return err
}
return w.mailService.Send(context.Background(), p.To, p.Subject, p.HTMLBody)
}

func (w *WorkerServer) handleProcessSubmission(_ context.Context, t *asynq.Task) error {
var p queue.SubmissionPayload
if err := json.Unmarshal(t.Payload(), &p); err != nil {
return err
}
verdicts := []string{"Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"}
verdict := verdicts[rand.Intn(len(verdicts))]
runtimeMS := 5 + rand.Intn(220)
memoryKB := 128 + rand.Intn(4096)
time.Sleep(2 * time.Second)
return w.submissions.UpdateVerdict(context.Background(), p.SubmissionID, verdict, runtimeMS, memoryKB)
}
