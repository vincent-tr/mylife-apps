package store

import (
	"fmt"
)

type Closable interface {
	Close()
}

type Refreshable interface {
	Refresh()
}

type IView[TEntity Entity] interface {
	Closable
	Refreshable
	IContainer[TEntity]
}

type view[TEntity Entity] struct {
	source    IContainer[TEntity]
	container *Container[TEntity]
	listener  func(event *Event[TEntity])
}

func (v *view[TEntity]) AddListener(callback *func(event *Event[TEntity])) {
	v.container.AddListener(callback)
}

func (v *view[TEntity]) RemoveListener(callback *func(event *Event[TEntity])) {
	v.container.RemoveListener(callback)
}

func (v *view[TEntity]) Name() string {
	return v.container.Name()
}

func (v *view[TEntity]) Find(id string) (TEntity, bool) {
	return v.container.Find(id)
}

func (v *view[TEntity]) Get(id string) (TEntity, error) {
	return v.container.Get(id)
}

func (v *view[TEntity]) List() []TEntity {
	return v.container.List()
}

func (v *view[TEntity]) Size() int {
	return v.container.Size()
}

func (v *view[TEntity]) Filter(predicate func(obj TEntity) bool) []TEntity {
	return v.container.Filter(predicate)
}

func (v *view[TEntity]) Exists(predicate func(obj TEntity) bool) bool {
	return v.container.Exists(predicate)
}

func (v *view[TEntity]) Refresh() {
	for _, obj := range v.source.List() {
		event := &Event[TEntity]{typ: Update, before: obj, after: obj}
		v.listener(event)
	}
}

func (v *view[TEntity]) Close() {
	v.source.RemoveListener(&v.listener)
	v.container.Reset()
}

func NewView[TEntity Entity](source IContainer[TEntity], predicate func(obj TEntity) bool) IView[TEntity] {
	v := &view[TEntity]{
		source:    source,
		container: NewContainer[TEntity](fmt.Sprintf("view(%s)", source.Name())),
	}

	v.listener = func(event *Event[TEntity]) {
		switch event.Type() {
		case Create:
			obj := event.After()
			if predicate(obj) {
				v.container.Set(obj)
			}

		case Update:
			obj := event.After()
			if predicate(obj) {
				v.container.Set(obj)
			} else {
				v.container.Delete(obj.Id())
			}

		case Remove:
			obj := event.Before()
			v.container.Delete(obj.Id())
		}
	}

	for _, obj := range source.List() {
		if predicate(obj) {
			v.container.Set(obj)
		}
	}

	v.source.AddListener(&v.listener)

	return v
}
