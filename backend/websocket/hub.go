package websocket

import (
	"net/http"
	"net/url"
	"slices"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type client struct {
	conn *websocket.Conn
	mu   sync.Mutex
}

type Hub struct {
	mu      sync.RWMutex
	clients map[*client]struct{}
	allowed []string
	upgrade websocket.Upgrader
}

func NewHub(allowedOrigins []string) *Hub {
	return &Hub{
		clients: map[*client]struct{}{},
		allowed: allowedOrigins,
		upgrade: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				if origin == "" {
					return false
				}
				u, err := url.Parse(origin)
				if err != nil {
					return false
				}
				normalized := u.Scheme + "://" + u.Host
				return slices.Contains(allowedOrigins, normalized)
			},
		},
	}
}

func (h *Hub) Handle(c *gin.Context) {
	conn, err := h.upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	cl := &client{conn: conn}
	h.mu.Lock()
	h.clients[cl] = struct{}{}
	h.mu.Unlock()
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
	h.mu.Lock()
	delete(h.clients, cl)
	h.mu.Unlock()
	_ = conn.Close()
}

func (h *Hub) BroadcastJSON(v any) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		c.mu.Lock()
		_ = c.conn.WriteJSON(v)
		c.mu.Unlock()
	}
}
