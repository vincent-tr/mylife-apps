package web

import (
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

	image := images.GetNextImage(smallDevice)

	// Set headers to disable caching
	w.Header().Set("Content-Type", image.ContentType)
	w.Header().Set("X-Album-Name", image.AlbumName)
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	w.WriteHeader(200)
	w.Write(image.Content)
}
