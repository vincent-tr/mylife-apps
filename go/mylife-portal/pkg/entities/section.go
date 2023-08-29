package entities

import (
	"mylife-tools-server/services/io/serialization"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Section struct {
	id      string
	code    string
	display string
	order   int
	items   []string
}

func (section *Section) Id() string {
	return section.id
}

func (section *Section) Code() string {
	return section.code
}

func (section *Section) Display() string {
	return section.display
}

func (section *Section) Order() int {
	return section.order
}

func (section *Section) Items() []string {
	return section.items
}

func (section *Section) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "section")
	helper.Add("_id", section.id)
	helper.Add("code", section.code)
	helper.Add("display", section.display)
	helper.Add("order", section.order)
	helper.Add("items", section.items)

	return helper.Build()
}

type sectionData struct {
	Id      primitive.ObjectID `bson:"_id"`
	Code    string             `bson:"code"`
	Display string             `bson:"display"`
	Order   int                `bson:"order"`
	Items   []string           `bson:"items"`
}

func sectionEncode(section *Section) ([]byte, error) {
	id, err := primitive.ObjectIDFromHex(section.id)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(sectionData{
		Id:      id,
		Code:    section.code,
		Display: section.display,
		Order:   section.order,
		Items:   section.items,
	})
}

func sectionDecode(raw []byte) (*Section, error) {
	data := sectionData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	section := &Section{
		id:      data.Id.Hex(),
		code:    data.Code,
		display: data.Display,
		order:   data.Order,
		items:   data.Items,
	}

	return section, nil
}
