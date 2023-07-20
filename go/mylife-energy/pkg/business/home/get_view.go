package home

import (
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/live"
	"mylife-energy/pkg/services/tesla"
	"mylife-tools-server/services/store"
	"time"
)

type homeDataView struct {
	teslaView         store.IContainer[*entities.TeslaState]
	liveView          store.IContainer[*entities.Measure]
	container         *store.Container[*entities.HomeData]
	teslaViewListener func(event *store.Event[*entities.TeslaState])
	liveViewListener  func(event *store.Event[*entities.Measure])
}

func (v *homeDataView) AddListener(callback *func(event *store.Event[*entities.HomeData])) {
	v.container.AddListener(callback)
}

func (v *homeDataView) RemoveListener(callback *func(event *store.Event[*entities.HomeData])) {
	v.container.RemoveListener(callback)
}

func (v *homeDataView) Name() string {
	return v.container.Name()
}

func (v *homeDataView) Find(id string) (*entities.HomeData, bool) {
	return v.container.Find(id)
}

func (v *homeDataView) Get(id string) (*entities.HomeData, error) {
	return v.container.Get(id)
}

func (v *homeDataView) List() []*entities.HomeData {
	return v.container.List()
}

func (v *homeDataView) Size() int {
	return v.container.Size()
}

func (v *homeDataView) Filter(predicate func(obj *entities.HomeData) bool) []*entities.HomeData {
	return v.container.Filter(predicate)
}

func (v *homeDataView) Exists(predicate func(obj *entities.HomeData) bool) bool {
	return v.container.Exists(predicate)
}

func (v *homeDataView) Close() {
	v.teslaView.RemoveListener(&v.teslaViewListener)
	v.liveView.RemoveListener(&v.liveViewListener)
	v.container.Reset()
}

func (v *homeDataView) update() {
	teslaState, ok := v.teslaView.Find(tesla.ViewStateId)
	if ok {
		updateValue(v, "tesla", "battery-level", teslaState.BatteryLevel(), func(a, b int) bool { return a == b })
		updateValue(v, "tesla", "last-update", teslaState.BatteryLastTimestamp(), func(a, b time.Time) bool { return a.Equal(b) })
	}

	liveMeasure, ok := v.liveView.Find("total-real-power")
	if ok {
		updateValue(v, "live", "total-power", liveMeasure.Value(), func(a, b float64) bool { return a == b })
		updateValue(v, "live", "last-update", liveMeasure.Timestamp(), func(a, b time.Time) bool { return a.Equal(b) })
	}
}

func updateValue[TValue any](v *homeDataView, section string, key string, value TValue, equalityComparer func(a, b TValue) bool) {
	id := section + "/" + key

	existing, exists := v.container.Find(id)
	if exists && equalityComparer(value, existing.Value().(TValue)) {
		return
	}

	v.container.Set(entities.NewHomeData(&entities.HomeDataValues{
		Id:      id,
		Section: section,
		Key:     key,
		Value:   value,
	}))
}

func GetView() store.IContainer[*entities.HomeData] {
	v := &homeDataView{
		teslaView: tesla.GetStateView(),
		liveView:  live.GetMeasures(),
		container: store.NewContainer[*entities.HomeData]("home-data-view"),
	}

	v.teslaViewListener = func(event *store.Event[*entities.TeslaState]) {
		v.update()
	}

	v.liveViewListener = func(event *store.Event[*entities.Measure]) {
		v.update()
	}

	v.update()

	v.teslaView.AddListener(&v.teslaViewListener)
	v.liveView.AddListener(&v.liveViewListener)

	return v
}
