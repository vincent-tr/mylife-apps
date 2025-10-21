package web

import (
	"mylife-idly/pkg/services/images"
	"net/http"
)

type imageHandler struct {
}

func makeImageHandler() *imageHandler {
	ih := &imageHandler{}

	return ih
}

func (ih *imageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	content, contentType := images.GetNextImage()

	// Set headers to disable caching
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	w.WriteHeader(200)
	w.Write(content)
}
