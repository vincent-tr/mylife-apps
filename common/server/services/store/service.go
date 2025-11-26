package store

import (
	"fmt"
	"mylife-tools/log"
	"mylife-tools/services"
	"mylife-tools/services/tasks"
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
			service.setupCollection(builder)
		}

		for _, builder := range materializedViewBuilders {
			service.setupMaterializedView(builder)
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

func (service *storeService) getCollection(name string) genericInternalCollection {
	value, exists := service.collections[name]
	if !exists {
		panic(fmt.Errorf("collection '%s' not found", name))
	}

	return value
}

func (service *storeService) setupCollection(builder icollectionBuilder) {
	name := builder.name()
	_, exists := service.collections[name]

	if exists {
		panic(fmt.Errorf("collection '%s' already exists", name))
	}

	service.collections[name] = builder.build()
}

func (service *storeService) getMaterializedView(name string) genericInternalView {
	value, exists := service.materializedViews[name]
	if !exists {
		panic(fmt.Errorf("materialized view '%s' not found", name))
	}

	return value
}

func (service *storeService) setupMaterializedView(builder imaterializedViewBuilder) {
	name := builder.name()
	_, exists := service.materializedViews[name]

	if exists {
		panic(fmt.Errorf("materialized view '%s' already exists", name))
	}

	view := builder.build()

	service.materializedViews[name] = view
}

func getService() *storeService {
	return services.GetService[*storeService]("store")
}

// Public access

func SetupCollection(builder icollectionBuilder) {
	getService().setupCollection(builder)
}

func GetCollection[TEntity Entity](name string) ICollection[TEntity] {
	value := getService().getCollection(name)

	col, ok := value.(ICollection[TEntity])
	if !ok {
		panic(fmt.Errorf("collection '%s' requested with bad entity type", name))
	}

	return col
}

func GetMaterializedView[TEntity Entity](name string) IView[TEntity] {
	value := getService().getMaterializedView(name)

	view, ok := value.(IView[TEntity])
	if !ok {
		panic(fmt.Errorf("materialized view '%s' requested with bad entity type", name))
	}

	view = WrapUnclosableView(view)

	return view
}
