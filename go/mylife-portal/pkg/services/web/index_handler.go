package web

import (
	"fmt"
	"io/fs"
	"mylife-portal/pkg/entities"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"net/http"
	"sync"

	"github.com/aymerick/raymond"
	"golang.org/x/exp/slices"
)

type indexHandler struct {
	template         *raymond.Template
	sections         store.ICollection[*entities.Section]
	items            store.ICollection[*entities.Item]
	sectionsCallback func(event *store.Event[*entities.Section])
	itemsCallback    func(event *store.Event[*entities.Item])
	pendingUpdate    bool
	page             string
	pageMutex        sync.RWMutex
}

func makeIndexHandler(fsys fs.FS) (*indexHandler, error) {
	content, err := fs.ReadFile(fsys, "index.template")
	if err != nil {
		return nil, err
	}

	ih := &indexHandler{}

	ih.template, err = raymond.Parse(string(content))
	if err != nil {
		return nil, err
	}

	ih.sections, err = store.GetCollection[*entities.Section]("sections")
	if err != nil {
		return nil, err
	}

	ih.items, err = store.GetCollection[*entities.Item]("items")
	if err != nil {
		return nil, err
	}

	ih.sectionsCallback = func(event *store.Event[*entities.Section]) {
		ih.onCollectionChanged()
	}

	ih.itemsCallback = func(event *store.Event[*entities.Item]) {
		ih.onCollectionChanged()
	}

	err = ih.update()
	if err != nil {
		return nil, err
	}

	ih.sections.AddListener(&ih.sectionsCallback)
	ih.items.AddListener(&ih.itemsCallback)

	return ih, nil
}

func (ih *indexHandler) terminate() {
	ih.sections.RemoveListener(&ih.sectionsCallback)
	ih.items.RemoveListener(&ih.itemsCallback)
	ih.template = nil
	ih.page = ""
}

func (ih *indexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ih.pageMutex.RLock()
	defer ih.pageMutex.RUnlock()

	fmt.Fprintf(w, ih.page)
}

func (ih *indexHandler) onCollectionChanged() {
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
func (ih *indexHandler) update() error {
	ih.pageMutex.Lock()
	defer ih.pageMutex.Unlock()

	ctx, err := ih.buildContext()
	if err != nil {
		logger.WithError(err).Error("Error building context image")
		ih.page = "Render error"
		return err
	}

	ih.page, err = ih.template.Exec(ctx)
	if err != nil {
		logger.WithError(err).Error("Error rendering template image")
		ih.page = "Render error"
		return err
	}

	logger.Info("Template rendered")

	return nil
}

func (ih *indexHandler) buildContext() (interface{}, error) {
	type contextItem struct {
		Code    string
		Display string
		Target  string
	}

	type contextSection struct {
		Display string
		Items   []contextItem
	}

	type context struct {
		Sections []contextSection
	}

	sections, err := store.GetCollection[*entities.Section]("sections")
	if err != nil {
		return nil, err
	}

	items, err := store.GetCollection[*entities.Item]("items")
	if err != nil {
		return nil, err
	}

	sectionList := sections.List()

	slices.SortFunc(sectionList, func(a, b *entities.Section) bool {
		return a.Order() < b.Order()
	})

	itemMap := make(map[string]*entities.Item)

	for _, item := range items.List() {
		itemMap[item.Code()] = item
	}

	ctx := &context{
		Sections: make([]contextSection, 0),
	}

	for _, section := range sectionList {
		ctxSec := contextSection{
			Display: section.Display(),
			Items:   make([]contextItem, 0),
		}

		for _, itemCode := range section.Items() {
			item, ok := itemMap[itemCode]
			if !ok {
				logger.WithField("code", itemCode).Warn("Could not find item, may happen at initial collection loading")
				continue
			}

			ctxItem := contextItem{
				Code:    item.Code(),
				Display: item.Display(),
				Target:  item.Target(),
			}

			ctxSec.Items = append(ctxSec.Items, ctxItem)
		}

		ctx.Sections = append(ctx.Sections, ctxSec)
	}

	return ctx, nil
}
