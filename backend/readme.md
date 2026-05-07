# QBITRA Backend

Enterprise-grade backend scaffold using Go + Gin + MongoDB + Redis + JWT + Asynq + WebSocket.

## Run locally

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/server
```

## Worker mode

```bash
RUN_WORKERS=true go run ./cmd/server
```

## API prefixes

- `/api/auth`
- `/api/users`
- `/api/problems`
- `/api/submissions`
- `/api/contests`
- `/api/comments`
- `/api/admin`
