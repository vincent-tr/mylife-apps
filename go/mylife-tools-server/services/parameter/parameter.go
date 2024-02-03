package parameter

import (
	"fmt"
	"mylife-tools-server/services/store"

	"github.com/gookit/goutil/errorx/panics"
)

type ParameterType interface {
	~int64 | ~float64 | ~string
}

type Parameter[DataType ParameterType, PublicType any] interface {
	store.IEventEmitter[PublicType]

	Name() string

	IsLoaded() bool

	Get() PublicType
	Set(value PublicType)
}

func NewParameter[DataType ParameterType, PublicType any](name string, defaultValue PublicType, converter Converter[DataType, PublicType]) Parameter[DataType, PublicType] {
	return &parameterImpl[DataType, PublicType]{
		name:      name,
		defValue:  defaultValue,
		converter: converter,
		emitter:   *store.NewEventEmitter[PublicType](),
	}
}

type untypedParameter interface {
	update(value any)
	Name() string
	defaultValue() any
}

var _ Parameter[string, string] = (*parameterImpl[string, string])(nil)
var _ untypedParameter = (*parameterImpl[string, string])(nil)

type parameterImpl[DataType ParameterType, PublicType any] struct {
	name      string
	id        string // quicker access wen initialized
	converter Converter[DataType, PublicType]
	defValue  any
	emitter   store.EventEmitter[PublicType]
}

// Note: will not get even until Get or Set is called
func (param *parameterImpl[DataType, PublicType]) AddListener(callback *func(newValue *PublicType)) {
	param.emitter.AddListener(callback)
}

// Note: will not get even until Get or Set is called
func (param *parameterImpl[DataType, PublicType]) RemoveListener(callback *func(newValue *PublicType)) {
	param.emitter.RemoveListener(callback)
}

func (param *parameterImpl[DataType, PublicType]) Name() string {
	return param.name
}

func (param *parameterImpl[DataType, PublicType]) defaultValue() any {
	return param.defValue
}

func (param *parameterImpl[DataType, PublicType]) IsLoaded() bool {
	return getService().IsLoaded()
}

func (param *parameterImpl[DataType, PublicType]) Get() PublicType {
	panics.IsTrue(param.IsLoaded())

	err := param.checkInit()
	if err != nil {
		panic(err)
	}

	service := getService()
	value, err := service.get(param.id)
	if err != nil {
		panic(err)
	}

	return param.convertToPublic(value)
}

func (param *parameterImpl[DataType, PublicType]) Set(value PublicType) {
	panics.IsTrue(param.IsLoaded())

	err := param.checkInit()
	if err != nil {
		panic(err)
	}

	service := getService()
	err = service.update(param.id, param.convertFromPublic(value))
	if err != nil {
		panic(err)
	}
}

func (param *parameterImpl[DataType, PublicType]) update(value any) {
	typedValue := param.convertToPublic(value)
	param.emitter.Emit(&typedValue)
}

func (param *parameterImpl[DataType, PublicType]) checkInit() error {
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

func (param *parameterImpl[DataType, PublicType]) convertToPublic(value any) PublicType {
	dataValue, ok := value.(DataType)
	if !ok {
		panic(fmt.Errorf("could not update %+v from database", value))
	}

	return param.converter.DataToPublic(dataValue)
}

func (param *parameterImpl[DataType, PublicType]) convertFromPublic(value PublicType) any {
	return param.converter.PublicToData(value)
}

type Converter[DataType ParameterType, PublicType any] interface {
	DataToPublic(value DataType) PublicType
	PublicToData(value PublicType) DataType
}

func NewIdentityConverter[Type ParameterType]() Converter[Type, Type] {
	return &identityConverter[Type]{}
}

var _ Converter[string, string] = (*identityConverter[string])(nil)

type identityConverter[Type ParameterType] struct {
}

func (*identityConverter[Type]) DataToPublic(value Type) Type {
	return value
}

func (*identityConverter[Type]) PublicToData(value Type) Type {
	return value
}
