package parameter

import (
	"fmt"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/database"
	"mylife-tools-server/services/parameter/entities"
	"mylife-tools-server/services/store"
	"reflect"
	"sync"

	"github.com/gookit/goutil/errorx/panics"
)

var logger = log.CreateLogger("mylife:server:parameter")

type parameterService struct {
	collection         store.ICollection[*entities.Parameter]
	collectionCallback func(event *store.Event[*entities.Parameter])
	parameters         map[string]untypedParameter
	mux                sync.Mutex
}

func (service *parameterService) Init(arg interface{}) error {

	service.parameters = make(map[string]untypedParameter)

	store.SetupCollection(entities.CollectionDef)

	service.collection = store.GetCollection[*entities.Parameter]("parameters")

	service.collectionCallback = func(event *store.Event[*entities.Parameter]) {
		service.onCollectionChanged(event)
	}

	service.collection.AddListener(&service.collectionCallback)

	return nil
}

func (service *parameterService) Terminate() error {
	service.collection.RemoveListener(&service.collectionCallback)
	service.collection = nil

	return nil
}

func (service *parameterService) ServiceName() string {
	return "parameter"
}

func (service *parameterService) Dependencies() []string {
	return []string{"store"}
}

func (service *parameterService) onCollectionChanged(event *store.Event[*entities.Parameter]) {
	switch event.Type() {
	case store.Create, store.Update:
		entity := event.After()

		switch value := entity.Value().(type) {
		case int64:
		case float64:
		case string:
		default:
			panic(fmt.Errorf("parameter '%s' has unsupported type '%s'", entity.Name(), reflect.TypeOf(value)))
			return
		}

		logger.Infof("Parameter '%s' set to '%+v'", entity.Name(), entity.Value())

		param := service.parameters[entity.Name()]
		if param != nil {
			param.update(entity.Value())
		}

	case store.Remove:
		panic(fmt.Errorf("parameter '%s' removed remotely, unsupported", event.Before().Name()))
	}
}

func (service *parameterService) init(param untypedParameter) (string, error) {
	service.mux.Lock()
	defer service.mux.Unlock()

	if _, exists := service.parameters[param.Name()]; exists {
		return "", fmt.Errorf("Parameter '%s' already exists", param.Name())
	}

	service.parameters[param.Name()] = param

	existings := service.collection.Filter(func(obj *entities.Parameter) bool {
		return obj.Name() == param.Name()
	})

	panics.IsTrue(len(existings) <= 1)

	if len(existings) == 1 {
		return existings[0].Id(), nil
	}

	logger.Infof("New parameter '%s' with default value %+v", param.Name(), param.defaultValue())

	obj := entities.NewParameter(database.MakeId(), param.Name(), param.defaultValue())
	obj, err := service.collection.Set(obj)
	if err != nil {
		return "", err
	}

	return obj.Id(), nil
}

func (service *parameterService) get(id string) (any, error) {
	obj, err := service.collection.Get(id)
	if err != nil {
		return nil, err
	}

	return obj.Value(), nil
}

func (service *parameterService) update(id string, value any) error {
	obj, err := service.collection.Get(id)
	if err != nil {
		return err
	}

	if obj.Value() == value {
		return nil
	}

	logger.Infof("Update parameter '%s' to value %+v", obj.Name(), value)

	_, err = service.collection.Set(obj.Update(value))
	if err != nil {
		return err
	}

	return nil
}

func (service *parameterService) IsLoaded() bool {
	return service.collection.IsLoaded()
}

func init() {
	services.Register(&parameterService{})
}

func getService() *parameterService {
	return services.GetService[*parameterService]("parameter")
}
