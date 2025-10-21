package web

import (
	"io/fs"
	"net/http"
)

type fileEntry struct {
	content     []byte
	contentType string
}

type fileServerHandler struct {
	files map[string]*fileEntry
}

func makeFileServerHandler(efs fs.FS) (*fileServerHandler, error) {
	files := make(map[string]*fileEntry)

	// Define the routes and their corresponding files
	routes := map[string]struct {
		filePath    string
		contentType string
	}{
		"/":            {"index.html", "text/html; charset=utf-8"},
		"/slideshow":   {"slideshow.html", "text/html; charset=utf-8"},
		"/favicon.ico": {"favicon.ico", "image/x-icon"},
	}

	for route, fileInfo := range routes {
		content, err := fs.ReadFile(efs, fileInfo.filePath)
		if err != nil {
			logger.WithError(err).Errorf("Failed to load file '%s' for route '%s'", fileInfo.filePath, route)
			return nil, err
		}

		files[route] = &fileEntry{
			content:     content,
			contentType: fileInfo.contentType,
		}

		logger.Debugf("Loaded file '%s' for route '%s' (%d bytes)", fileInfo.filePath, route, len(content))
	}

	return &fileServerHandler{
		files: files,
	}, nil
}

func (fsh *fileServerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fileEntry, exists := fsh.files[r.URL.Path]
	if !exists {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("Content-Type", fileEntry.contentType)
	w.Write(fileEntry.content)
}
