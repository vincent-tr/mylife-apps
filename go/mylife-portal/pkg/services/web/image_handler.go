package web

import (
	"fmt"
	"mylife-portal/pkg/entities"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

type imageData struct {
	content []byte
	mime    string
}

type imageHandler struct {
	items         store.ICollection[*entities.Item]
	itemsCallback func(event *store.Event[*entities.Item])
	pendingUpdate bool
	images        map[string]imageData
	imagesMutex   sync.RWMutex
}

func makeImageHandler() (*imageHandler, error) {
	ih := &imageHandler{}

	var err error

	ih.items, err = store.GetCollection[*entities.Item]("items")
	if err != nil {
		return nil, err
	}

	ih.itemsCallback = func(event *store.Event[*entities.Item]) {
		ih.onCollectionChanged()
	}

	err = ih.update()
	if err != nil {
		return nil, err
	}

	ih.items.AddListener(&ih.itemsCallback)

	return ih, nil
}

func (ih *imageHandler) terminate() {
	ih.items.RemoveListener(&ih.itemsCallback)
	ih.images = nil
}

func (ih *imageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ih.imagesMutex.RLock()
	defer ih.imagesMutex.RUnlock()

	vars := mux.Vars(r)
	code, ok := vars["code"]
	if !ok {
		logger.WithField("path", r.URL.Path).Error("Error serving image: could not fetch code")
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}

	image, ok := ih.images[code]
	if !ok {
		logger.Errorf("Error serving image: Could not find item with code '%s'", code)
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", image.mime)
	w.WriteHeader(200)
	w.Write(image.content)
}

func (ih *imageHandler) onCollectionChanged() {
	// Debounce
	if ih.pendingUpdate {
		return
	}

	ih.pendingUpdate = true

	tasks.SubmitEventLoop("web/template-render", func() {
		ih.pendingUpdate = false
		ih.update()
	})
}

// Returns error for initial render
func (ih *imageHandler) update() error {
	ih.imagesMutex.Lock()
	defer ih.imagesMutex.Unlock()

	ih.images = make(map[string]imageData)

	collection, err := store.GetCollection[*entities.Item]("items")
	if err != nil {
		logger.WithError(err).Error("Error building image cache")
		return err
	}

	for _, image := range collection.List() {
		ih.images[image.Code()] = imageData{
			content: image.Icon(),
			mime:    image.IconMime(),
		}
	}

	logger.WithField("count", len(ih.images)).Info("Images cached")

	return nil
}

func findItemByCode(code string) (*entities.Item, error) {
	collection, err := store.GetCollection[*entities.Item]("items")
	if err != nil {
		return nil, err
	}

	for _, item := range collection.List() {
		if item.Code() == code {
			return item, nil
		}
	}

	return nil, fmt.Errorf("Could not find item with code '%s'", code)
}
