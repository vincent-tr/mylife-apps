package store

import (
	"fmt"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/tasks"
)

const storeUpdateQueueId = "store-update"

var logger = log.CreateLogger("mylife:server:store")

func init() {
	services.Register(&storeService{})
}

type storeService struct {
	collections       map[string]genericInternalCollection
	materializedViews map[string]genericInternalView
}

func (service *storeService) Init(arg interface{}) error {

	if err := tasks.CreateQueue(storeUpdateQueueId); err != nil {
		return err
	}

	service.collections = make(map[string]genericInternalCollection)
	service.materializedViews = make(map[string]genericInternalView)

	if arg != nil {
		builders := arg.([]interface{})

		collectionBuilders := make([]icollectionBuilder, 0)
		materializedViewBuilders := make([]imaterializedViewBuilder, 0)

		for _, builder := range builders {
			switch builder := builder.(type) {
			case icollectionBuilder:
				collectionBuilders = append(collectionBuilders, builder)

			case imaterializedViewBuilder:
				materializedViewBuilders = append(materializedViewBuilders, builder)

			default:
				return fmt.Errorf("unknown builder type: %T", builder)
			}
		}

		// Setup collections then materialized views
		for _, builder := range collectionBuilders {
			if err := service.setupCollection(builder); err != nil {
				return err
			}
		}

		for _, builder := range materializedViewBuilders {
			if err := service.setupMaterializedView(builder); err != nil {
				return err
			}
		}
	}

	return nil
}

func (service *storeService) Terminate() error {
	for _, col := range service.collections {
		col.terminate()
	}

	for _, view := range service.materializedViews {
		view.Close()
	}

	service.collections = nil
	service.materializedViews = nil

	return tasks.CloseQueue(storeUpdateQueueId)
}

func (service *storeService) ServiceName() string {
	return "store"
}

func (service *storeService) Dependencies() []string {
	return []string{"database", "tasks"}
}

func (service *storeService) getCollection(name string) (genericInternalCollection, error) {
	value, exists := service.collections[name]
	if !exists {
		return nil, fmt.Errorf("collection '%s' not found", name)
	}

	return value, nil
}

func (service *storeService) setupCollection(builder icollectionBuilder) error {
	name := builder.name()
	_, exists := service.collections[name]

	if exists {
		return fmt.Errorf("collection '%s' already exists", name)
	}

	service.collections[name] = builder.build()

	return nil
}

func (service *storeService) getMaterializedView(name string) (genericInternalView, error) {
	value, exists := service.materializedViews[name]
	if !exists {
		return nil, fmt.Errorf("materialized view '%s' not found", name)
	}

	return value, nil
}

func (service *storeService) setupMaterializedView(builder imaterializedViewBuilder) error {
	name := builder.name()
	_, exists := service.materializedViews[name]

	if exists {
		return fmt.Errorf("materialized view '%s' already exists", name)
	}

	view, err := builder.build()
	if err != nil {
		return fmt.Errorf("error building materialized view '%s': %w", name, err)
	}

	service.materializedViews[name] = view

	return nil
}

func getService() *storeService {
	return services.GetService[*storeService]("store")
}

// Public access

func SetupCollection[TEntity Entity](builder *CollectionBuilder[TEntity]) error {
	return getService().setupCollection(builder)
}

func GetCollection[TEntity Entity](name string) (ICollection[TEntity], error) {
	value, err := getService().getCollection(name)
	if err != nil {
		return nil, err
	}

	col, ok := value.(ICollection[TEntity])
	if !ok {
		return nil, fmt.Errorf("collection '%s' requested with bad entity type", name)
	}

	return col, nil
}

func GetMaterializedView[TEntity Entity](name string) (IView[TEntity], error) {
	value, err := getService().getMaterializedView(name)
	if err != nil {
		return nil, err
	}

	view, ok := value.(IView[TEntity])
	if !ok {
		return nil, fmt.Errorf("materialized view '%s' requested with bad entity type", name)
	}

	return view, nil
}
