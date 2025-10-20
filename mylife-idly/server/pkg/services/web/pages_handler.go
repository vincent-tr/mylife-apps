package web

import (
	"fmt"
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"
)

type pagesHandler struct {
	pages map[string]string
}

func makePagesHandler(fsys fs.FS) (*pagesHandler, error) {
	ph := &pagesHandler{
		pages: make(map[string]string),
	}

	err := fs.WalkDir(fsys, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() || filepath.Dir(path) != "." {
			return nil
		}

		if strings.HasSuffix(strings.ToLower(path), ".html") {
			htmlContent, readErr := fs.ReadFile(fsys, path)
			if readErr != nil {
				logger.WithError(readErr).WithField("file", path).Error("Failed to read HTML file")
				return nil
			}

			routePath := strings.TrimSuffix(path, ".html")
			ph.pages[routePath] = string(htmlContent)
			logger.WithField("route", "/"+routePath).WithField("file", path).Info("HTML page registered")
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to scan HTML files: %w", err)
	}

	logger.WithField("count", len(ph.pages)).Info("HTML pages loaded")

	return ph, nil
}

func (ph *pagesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Extract the path and remove leading slash
	path := strings.TrimPrefix(r.URL.Path, "/")

	// Look for HTML page content
	if htmlContent, exists := ph.pages[path]; exists {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, htmlContent)
		return
	}

	// Page not found
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "404 - Page not found: %s", path)
}
