package entities

import (
	"mylife-tools-server/services/io/serialization"
)

type HomeData struct {
	id      string
	section string
	key     string
	value   any
}

func (data *HomeData) Id() string {
	return data.id
}

func (data *HomeData) Section() string {
	return data.section
}

func (data *HomeData) Key() string {
	return data.key
}

func (data *HomeData) Value() any {
	return data.value
}

func (data *HomeData) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", data.id)
	helper.Add("section", data.section)
	helper.Add("key", data.key)
	helper.Add("value", data.value)

	return helper.Build()
}

func HomeDatasEqual(a *HomeData, b *HomeData) bool {
	return a.id == b.id &&
		a.section == b.section &&
		a.key == b.key &&
		a.value == b.value
}

type HomeDataValues struct {
	Id      string
	Section string
	Key     string
	Value   any
}

func NewHomeData(values *HomeDataValues) *HomeData {
	return &HomeData{
		id:      values.Id,
		section: values.Section,
		key:     values.Key,
		value:   values.Value,
	}
}

func UpdateHomeDataValue(data *HomeData, value any) *HomeData {
	return &HomeData{
		id:      data.id,
		section: data.section,
		key:     data.key,
		value:   value,
	}
}
