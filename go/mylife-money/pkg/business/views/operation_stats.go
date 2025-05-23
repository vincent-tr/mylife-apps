package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"time"
)

type operationStats struct {
	operations      store.ICollection[*entities.Operation]
	container       *store.Container[*entities.ReportOperationStat]
	countId         string
	lastDateId      string
	unsortedCountId string
	changeCallback  func(*store.Event[*entities.Operation])
}

var _ store.IView[*entities.ReportOperationStat] = (*operationStats)(nil)

func (view *operationStats) AddListener(callback *func(event *store.Event[*entities.ReportOperationStat])) {
	view.container.AddListener(callback)
}

func (view *operationStats) RemoveListener(callback *func(event *store.Event[*entities.ReportOperationStat])) {
	view.container.RemoveListener(callback)
}

func (view *operationStats) Name() string {
	return view.container.Name()
}

func (view *operationStats) Find(id string) (*entities.ReportOperationStat, bool) {
	return view.container.Find(id)
}

func (view *operationStats) Get(id string) (*entities.ReportOperationStat, error) {
	return view.container.Get(id)
}

func (view *operationStats) List() []*entities.ReportOperationStat {
	return view.container.List()
}

func (view *operationStats) Size() int {
	return view.container.Size()
}

func (view *operationStats) Filter(predicate func(obj *entities.ReportOperationStat) bool) []*entities.ReportOperationStat {
	return view.container.Filter(predicate)
}

func (view *operationStats) Exists(predicate func(obj *entities.ReportOperationStat) bool) bool {
	return view.container.Exists(predicate)
}

func (view *operationStats) Close() {
	view.operations.RemoveListener(&view.changeCallback)
	view.container.Reset()
}

func (view *operationStats) Refresh() {
	view.setObject(view.countId, "count", view.operations.Size())
	view.setObject(view.lastDateId, "lastDate", view.findLastDate())
	view.setObject(view.unsortedCountId, "unsortedCount", view.computeUnsortedCount())
}

func NewOperationStats() store.IView[*entities.ReportOperationStat] {
	operations := store.GetCollection[*entities.Operation]("operations")

	view := &operationStats{
		operations:      operations,
		container:       store.NewContainer[*entities.ReportOperationStat]("operation-stats"),
		countId:         operations.NewId(),
		lastDateId:      operations.NewId(),
		unsortedCountId: operations.NewId(),
	}

	view.changeCallback = func(event *store.Event[*entities.Operation]) {
		view.Refresh()
	}

	operations.AddListener(&view.changeCallback)

	view.Refresh()

	return view
}

func (view *operationStats) findLastDate() any {
	lastDate := time.Unix(0, 0)
	lastDateSet := false

	for _, op := range view.operations.List() {
		if op.Date().After(lastDate) {
			lastDate = op.Date()
			lastDateSet = true
		}
	}

	if lastDateSet {
		return lastDate
	} else {
		return nil
	}
}

func (view *operationStats) computeUnsortedCount() any {
	currentYear := time.Now().Year()
	count := 0

	for _, op := range view.operations.List() {
		if op.Date().Year() == currentYear && op.Group() == nil {
			count++
		}
	}

	return count
}

func (view *operationStats) setObject(id string, code string, value any) {
	view.container.Set(entities.NewReportOperationStat(&entities.ReportOperationStatValues{
		Id:    id,
		Code:  code,
		Value: value,
	}))
}
