package store

type MaterializedViewBuilder[TEntity Entity] struct {
	viewName string
	factory  func() IView[TEntity]
}

type imaterializedViewBuilder interface {
	name() string
	build() genericInternalView
}

func MakeMaterializedViewBuilder[TEntity Entity](name string, factory func() IView[TEntity]) *MaterializedViewBuilder[TEntity] {
	return &MaterializedViewBuilder[TEntity]{
		viewName: name,
		factory:  factory,
	}
}

func (builder *MaterializedViewBuilder[TEntity]) name() string {
	return builder.viewName
}

func (builder *MaterializedViewBuilder[TEntity]) build() genericInternalView {
	return builder.factory()
}
