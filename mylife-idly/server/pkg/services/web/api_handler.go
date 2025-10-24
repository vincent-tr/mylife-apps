package web

import (
	"encoding/json"
	"mylife-idly/pkg/services/images"
	"net/http"
	"strings"
)

func imageHandler(w http.ResponseWriter, r *http.Request) {
	// Note: iPad 2 user agent:
	// Mozilla/5.0 (iPad; CPU OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1
	userAgent := r.Header.Get("User-Agent")
	smallDevice := false

	if strings.Contains(userAgent, "iPad; CPU OS 9_3_5") {
		smallDevice = true
	}

	content, contentType := images.GetNextImage(smallDevice)

	// Set headers to disable caching
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	w.WriteHeader(200)
	w.Write(content)
}

func albumHandler(w http.ResponseWriter, r *http.Request) {
	albumName := images.GetAlbumName()

	// Create response
	response := map[string]string{
		"album": albumName,
	}

	// Set headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	// Encode and send JSON
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
