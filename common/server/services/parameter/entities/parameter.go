package entities

import (
	"mylife-tools/services/io/serialization"
	"mylife-tools/services/store"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Parameter struct {
	id    string
	name  string
	value any
}

func (parameter *Parameter) Id() string {
	return parameter.id
}

func (parameter *Parameter) Name() string {
	return parameter.name
}

func (parameter *Parameter) Value() any {
	return parameter.value
}

func (parameter *Parameter) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "parameter")
	helper.Add("_id", parameter.id)
	helper.Add("name", parameter.name)
	helper.Add("value", parameter.value)

	return helper.Build()
}

func (parameter *Parameter) Update(value any) *Parameter {
	return &Parameter{
		id:    parameter.id,
		name:  parameter.name,
		value: value,
	}
}

func NewParameter(id string, name string, value any) *Parameter {
	return &Parameter{
		id:    id,
		name:  name,
		value: value,
	}
}

type parameterData struct {
	Id    bson.ObjectID `bson:"_id"`
	Name  string        `bson:"name"`
	Value any           `bson:"value"`
}

func parameterEncode(parameter *Parameter) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(parameter.id)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(parameterData{
		Id:    id,
		Name:  parameter.name,
		Value: parameter.value,
	})
}

func parameterDecode(raw []byte) (*Parameter, error) {
	data := parameterData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	parameter := &Parameter{
		id:    data.Id.Hex(),
		name:  data.Name,
		value: data.Value,
	}

	return parameter, nil
}

var CollectionDef = store.MakeCollectionBuilder[*Parameter]("parameters", "parameters", parameterDecode, parameterEncode)
