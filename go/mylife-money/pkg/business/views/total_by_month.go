package views

import (
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"time"
)

type totalByMonth struct {
	operations     store.ICollection[*entities.Operation]
	container      *store.Container[*entities.ReportTotalByMonth]
	changeCallback func(*store.Event[*entities.Operation])
}

var _ store.IView[*entities.ReportTotalByMonth] = (*totalByMonth)(nil)

func (view *totalByMonth) AddListener(callback *func(event *store.Event[*entities.ReportTotalByMonth])) {
	view.container.AddListener(callback)
}

func (view *totalByMonth) RemoveListener(callback *func(event *store.Event[*entities.ReportTotalByMonth])) {
	view.container.RemoveListener(callback)
}

func (view *totalByMonth) Name() string {
	return view.container.Name()
}

func (view *totalByMonth) Find(id string) (*entities.ReportTotalByMonth, bool) {
	return view.container.Find(id)
}

func (view *totalByMonth) Get(id string) (*entities.ReportTotalByMonth, error) {
	return view.container.Get(id)
}

func (view *totalByMonth) List() []*entities.ReportTotalByMonth {
	return view.container.List()
}

func (view *totalByMonth) Size() int {
	return view.container.Size()
}

func (view *totalByMonth) Filter(predicate func(obj *entities.ReportTotalByMonth) bool) []*entities.ReportTotalByMonth {
	return view.container.Filter(predicate)
}

func (view *totalByMonth) Exists(predicate func(obj *entities.ReportTotalByMonth) bool) bool {
	return view.container.Exists(predicate)
}

func (view *totalByMonth) Close() {
	view.operations.RemoveListener(&view.changeCallback)
	view.container.Reset()
}

func (view *totalByMonth) Refresh() {
	view.init()
}

func NewTotalByMonth() (store.IView[*entities.ReportTotalByMonth], error) {
	operations, err := store.GetCollection[*entities.Operation]("operations")
	if err != nil {
		return nil, err
	}

	container := store.NewContainer[*entities.ReportTotalByMonth]("total-by-month")

	view := &totalByMonth{
		operations: operations,
		container:  container,
	}

	view.changeCallback = view.onCollectionChange
	view.operations.AddListener(&view.changeCallback)

	view.init()

	return view, nil
}

func (view *totalByMonth) init() {
	months := getMonthList()
	for month := range months {
		view.computeBucket(month)
	}
}

func (view *totalByMonth) onCollectionChange(event *store.Event[*entities.Operation]) {
	months := getMonthList()

	switch event.Type() {
	case store.Create:
		month := DateToMonth(event.After().Date())

		if _, ok := months[month]; ok {
			view.computeBucket(month)
		}

	case store.Update:
		month1 := DateToMonth(event.Before().Date())
		month2 := DateToMonth(event.After().Date())

		// should be useless since amount cannot change
		if _, ok := months[month1]; ok {
			view.computeBucket(month1)
		}

		if _, ok := months[month2]; month1 != month2 && ok {
			// should not happen since date cannot change
			view.computeBucket(month2)
		}

	case store.Remove:
		// should not happen since operations cannot be removed
		month := DateToMonth(event.Before().Date())

		if _, ok := months[month]; ok {
			view.computeBucket(month)
		}

	default:
		panic(fmt.Sprintf("Unsupported event type: '%v'", event.Type()))
	}

	view.cleanOldBuckets(months)
}

func (view *totalByMonth) computeBucket(month string) {
	untypedIndex, err := view.operations.GetIndex("partition-by-month")
	if err != nil {
		panic(fmt.Sprintf("Failed to get index: %v", err))
	}

	index := untypedIndex.(store.IPartitionIndex[*entities.Operation, string])

	partition := index.FindPartition(month)
	if partition == nil {
		partition = make(map[string]*entities.Operation)
	}

	object := &entities.ReportTotalByMonthValues{
		Id:        month,
		Month:     month,
		Count:     0,
		SumDebit:  0,
		SumCredit: 0,
		Balance:   0,
	}

	for _, operation := range partition {
		object.Count++

		if operation.Amount() < 0 {
			object.SumDebit += -operation.Amount()
		} else {
			object.SumCredit += operation.Amount()
		}

		object.Balance += operation.Amount()
	}

	object.SumDebit = roundCurrency(object.SumDebit)
	object.SumCredit = roundCurrency(object.SumCredit)
	object.Balance = roundCurrency(object.Balance)

	view.container.Set(entities.NewReportTotalByMonth(object))
}

func (view *totalByMonth) cleanOldBuckets(months map[string]struct{}) {
	for _, object := range view.List() {
		id := object.Id()

		if _, ok := months[id]; !ok {
			view.container.Delete(id)
		}
	}
}

func getMonthList() map[string]struct{} {
	now := time.Now()
	minDate := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, time.UTC)
	array := monthRange(minDate, now)

	set := make(map[string]struct{})

	for _, month := range array {
		set[month] = struct{}{}
	}

	return set
}
