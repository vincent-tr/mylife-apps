package entities

import (
	"mylife-tools-server/services/io/serialization"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Item struct {
	id       string
	code     string
	display  string
	icon     []byte
	iconMime string
	target   string
}

func (item *Item) Id() string {
	return item.id
}

func (item *Item) Code() string {
	return item.code
}

func (item *Item) Display() string {
	return item.display
}

func (item *Item) Icon() []byte {
	return item.icon
}

func (item *Item) IconMime() string {
	return item.iconMime
}

func (item *Item) Target() string {
	return item.target
}

func (item *Item) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", item.id)
	helper.Add("code", item.code)
	helper.Add("display", item.display)
	helper.Add("icon", item.icon)
	helper.Add("iconMime", item.iconMime)
	helper.Add("target", item.target)

	return helper.Build()
}

type itemData struct {
	Id       primitive.ObjectID `bson:"_id"`
	Code     string             `bson:"code"`
	Display  string             `bson:"display"`
	Icon     []byte             `bson:"icon"`
	IconMime string             `bson:"iconMime"`
	Target   string             `bson:"target"`
}

func itemEncode(item *Item) ([]byte, error) {
	id, err := primitive.ObjectIDFromHex(item.id)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(itemData{
		Id:       id,
		Code:     item.code,
		Display:  item.display,
		Icon:     item.icon,
		IconMime: item.iconMime,
		Target:   item.target,
	})
}

func itemDecode(raw []byte) (*Item, error) {
	data := itemData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	item := &Item{
		id:       data.Id.Hex(),
		code:     data.Code,
		display:  data.Display,
		icon:     data.Icon,
		iconMime: data.IconMime,
		target:   data.Target,
	}

	return item, nil
}
