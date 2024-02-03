package parameter

import (
	"fmt"
	"mylife-tools-server/services/store"
	"sync"

	"github.com/gookit/goutil/errorx/panics"
)

type ParameterType interface {
	~int64 | ~float64 | ~string
}

type Parameter[Type ParameterType] interface {
	store.IEventEmitter[Type]

	Name() string

	IsLoaded() bool

	Get() Type
	Set(value Type)
}

func NewParameter[Type ParameterType](name string, defaultValue Type) Parameter[Type] {
	return &parameterImpl[Type]{
		name:     name,
		defValue: defaultValue,
		emitter:  *store.NewEventEmitter[Type](),
	}
}

type untypedParameter interface {
	update(value any)
	Name() string
	defaultValue() any
}

var _ Parameter[string] = (*parameterImpl[string])(nil)
var _ untypedParameter = (*parameterImpl[string])(nil)

type parameterImpl[Type ParameterType] struct {
	name     string
	id       string // quicker access wen initialized
	defValue any
	emitter  store.EventEmitter[Type]
	mux      sync.Mutex
}

// Note: will not get even until Get or Set is called
func (param *parameterImpl[Type]) AddListener(callback *func(event *Type)) {
	param.emitter.AddListener(callback)
}

// Note: will not get even until Get or Set is called
func (param *parameterImpl[Type]) RemoveListener(callback *func(event *Type)) {
	param.emitter.RemoveListener(callback)
}

func (param *parameterImpl[Type]) Name() string {
	return param.name
}

func (param *parameterImpl[Type]) defaultValue() any {
	return param.defValue
}

func (param *parameterImpl[Type]) IsLoaded() bool {
	return getService().IsLoaded()
}

func (param *parameterImpl[Type]) Get() Type {
	panics.IsTrue(param.IsLoaded())

	param.mux.Lock()
	defer param.mux.Unlock()

	err := param.checkInit()
	if err != nil {
		panic(err)
	}

	service := getService()
	value, err := service.get(param.id)
	if err != nil {
		panic(err)
	}

	return param.convert(value)
}

func (param *parameterImpl[Type]) Set(value Type) {
	panics.IsTrue(param.IsLoaded())

	param.mux.Lock()
	defer param.mux.Unlock()

	err := param.checkInit()
	if err != nil {
		panic(err)
	}

	service := getService()
	err = service.update(param.id, value)
	if err != nil {
		panic(err)
	}
}

func (param *parameterImpl[Type]) update(value any) {
	typedValue := param.convert(value)
	param.emitter.Emit(&typedValue)
}

func (param *parameterImpl[Type]) checkInit() error {
	service := getService()

	if param.id == "" {
		id, err := service.init(param)
		if err != nil {
			return err
		}

		param.id = id
	}

	return nil
}

func (param *parameterImpl[Type]) convert(value any) Type {
	typedValue, ok := value.(Type)
	if !ok {
		panic(fmt.Errorf("could not update %+v from database", value))
	}

	return typedValue
}
