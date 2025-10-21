package web

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gorilla/websocket"
)

type proxyHandler struct {
	target   *url.URL
	proxy    *httputil.ReverseProxy
	upgrader websocket.Upgrader
}

func makeProxyHandler(targetURL string) (*proxyHandler, error) {
	target, err := url.Parse(targetURL)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	// Configure the proxy to modify the request
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
		req.URL.Host = target.Host
		req.URL.Scheme = target.Scheme
	}

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for WebSocket connections
		},
	}

	ph := &proxyHandler{
		target:   target,
		proxy:    proxy,
		upgrader: upgrader,
	}

	return ph, nil
}

func (ph *proxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Check if this is a WebSocket upgrade request
	if isWebSocketRequest(r) {
		ph.handleWebSocket(w, r)
		return
	}

	// Handle regular HTTP requests
	ph.proxy.ServeHTTP(w, r)
}

func isWebSocketRequest(r *http.Request) bool {
	return strings.ToLower(r.Header.Get("Connection")) == "upgrade" &&
		strings.ToLower(r.Header.Get("Upgrade")) == "websocket"
}

func (ph *proxyHandler) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Create WebSocket connection to client
	clientConn, err := ph.upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.WithError(err).Error("Failed to upgrade client connection to WebSocket")
		return
	}
	defer clientConn.Close()

	// Create WebSocket connection to target server
	targetURL := *ph.target
	targetURL.Path = r.URL.Path
	targetURL.RawQuery = r.URL.RawQuery

	// Convert HTTP/HTTPS to WS/WSS
	if targetURL.Scheme == "http" {
		targetURL.Scheme = "ws"
	} else if targetURL.Scheme == "https" {
		targetURL.Scheme = "wss"
	}

	// Add WebSocket headers for the target connection
	// Only forward headers that should be forwarded, let the dialer generate the required ones
	headers := http.Header{}
	for key, values := range r.Header {
		// Only forward protocol, let the dialer handle all other WebSocket headers
		if key == "Sec-Websocket-Protocol" {
			headers[key] = values
		}
	}

	targetConn, _, err := websocket.DefaultDialer.Dial(targetURL.String(), headers)
	if err != nil {
		logger.WithError(err).Error("Failed to connect to target WebSocket server")
		return
	}
	defer targetConn.Close()

	// Start proxying messages bidirectionally
	done := make(chan struct{})

	// Proxy from client to target
	go func() {
		defer close(done)
		for {
			messageType, data, err := clientConn.ReadMessage()
			if err != nil {
				logger.WithError(err).Debug("Client WebSocket connection closed")
				return
			}
			if err := targetConn.WriteMessage(messageType, data); err != nil {
				logger.WithError(err).Error("Failed to write to target WebSocket")
				return
			}
		}
	}()

	// Proxy from target to client
	go func() {
		defer close(done)
		for {
			messageType, data, err := targetConn.ReadMessage()
			if err != nil {
				logger.WithError(err).Debug("Target WebSocket connection closed")
				return
			}
			if err := clientConn.WriteMessage(messageType, data); err != nil {
				logger.WithError(err).Error("Failed to write to client WebSocket")
				return
			}
		}
	}()

	// Wait for either connection to close
	<-done
}
