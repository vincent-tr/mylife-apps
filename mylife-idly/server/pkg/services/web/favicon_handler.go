package web

import (
	"io/fs"
	"net/http"
)

type faviconHandler struct {
	content []byte
}

func makeFaviconHandler(efs fs.FS) (*faviconHandler, error) {
	// Read the favicon from the embedded filesystem
	content, err := fs.ReadFile(efs, "favicon.ico")
	if err != nil {
		return nil, err
	}

	fh := &faviconHandler{
		content: content,
	}

	return fh, nil
}

func (fh *faviconHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Set appropriate headers for ICO favicon
	w.Header().Set("Content-Type", "image/x-icon")
	w.Header().Set("Cache-Control", "public, max-age=86400") // Cache for 24 hours

	w.Write(fh.content)
}
