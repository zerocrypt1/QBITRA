package logger

import (
"log/slog"
"os"
)

func New(env string) *slog.Logger {
opts := &slog.HandlerOptions{Level: slog.LevelInfo}
if env != "production" {
opts.Level = slog.LevelDebug
}
h := slog.NewJSONHandler(os.Stdout, opts)
return slog.New(h)
}
