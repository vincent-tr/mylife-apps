package web

import (
	"fmt"
	"io/fs"
	"net/http"

	"github.com/aymerick/raymond"
)

type indexHandler struct {
	content string
}

func makeIndexHandler(fsys fs.FS, target string) (*indexHandler, error) {
	content, err := fs.ReadFile(fsys, "index.template")
	if err != nil {
		return nil, err
	}

	ih := &indexHandler{}

	template, err := raymond.Parse(string(content))
	if err != nil {
		return nil, err
	}

	type context struct {
		Target string
	}

	ctx := &context{
		Target: target,
	}

	ih.content, err = template.Exec(ctx)
	if err != nil {
		return nil, err
	}

	logger.Info("Template rendered")

	return ih, nil
}

func (ih *indexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, ih.content)
}
