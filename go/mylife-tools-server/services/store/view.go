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
	genericInternalView
	Closable
	Refreshable
	IContainer[TEntity]
}

type genericInternalView interface {
	Closable
	Refreshable
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

type unclosableView[TEntity Entity] struct {
	target IView[TEntity]
}

func (v *unclosableView[TEntity]) AddListener(callback *func(event *Event[TEntity])) {
	v.target.AddListener(callback)
}

func (v *unclosableView[TEntity]) RemoveListener(callback *func(event *Event[TEntity])) {
	v.target.RemoveListener(callback)
}

func (v *unclosableView[TEntity]) Name() string {
	return v.target.Name()
}

func (v *unclosableView[TEntity]) Find(id string) (TEntity, bool) {
	return v.target.Find(id)
}

func (v *unclosableView[TEntity]) Get(id string) (TEntity, error) {
	return v.target.Get(id)
}

func (v *unclosableView[TEntity]) List() []TEntity {
	return v.target.List()
}

func (v *unclosableView[TEntity]) Size() int {
	return v.target.Size()
}

func (v *unclosableView[TEntity]) Filter(predicate func(obj TEntity) bool) []TEntity {
	return v.target.Filter(predicate)
}

func (v *unclosableView[TEntity]) Exists(predicate func(obj TEntity) bool) bool {
	return v.target.Exists(predicate)
}

func (v *unclosableView[TEntity]) Refresh() {
	v.target.Refresh()
}

func (v *unclosableView[TEntity]) Close() {
	// Do not close the original view
}

// Wrap the view to prevent closing: when the returned view is closed, it will not close the original view
//
// This is useful for materialized views that have a long lifetime, and are shared by multiple client sessions.
// When a session unnotifies the view, it should not close the original view.
func WrapUnclosableView[TEntity Entity](target IView[TEntity]) IView[TEntity] {
	return &unclosableView[TEntity]{target: target}
}
