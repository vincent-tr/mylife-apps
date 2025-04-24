package entities

import (
	"mylife-tools-server/services/io/serialization"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type RuleOperator string

const (
	RuleOperatorEq       RuleOperator = "$eq"
	RuleOperatorGt       RuleOperator = "$gt"
	RuleOperatorGte      RuleOperator = "$gte"
	RuleOperatorLt       RuleOperator = "$lt"
	RuleOperatorLte      RuleOperator = "$lte"
	RuleOperatorRegex    RuleOperator = "$regex"
	RuleOperatorContains RuleOperator = "$contains"
)

type Condition struct {
	Field    string       `json:"field" bson:"field"`
	Operator RuleOperator `json:"operator" json:"operator"`
	Value    any          `json:"value" json:"value"` // string or float64
}

type Rule struct {
	Name       string      `json:"name" bson:"name"`
	Conditions []Condition `json:"conditions" bson:"conditions"`
}

// Groupe
type Group struct {
	id      string
	parent  *string
	display string
	rules   []Rule
}

func (group *Group) Id() string {
	return group.id
}

// Parent
func (group *Group) Parent() *string {
	return group.parent
}

func (group *Group) ParentEq(parent *string) bool {
	if group.parent == nil {
		return parent == nil
	} else {
		return group.parent != nil && *group.parent == *parent
	}
}

// Affichage
func (group *Group) Display() string {
	return group.display
}

// Règles
func (group *Group) Rules() []Rule {
	return group.rules
}

func (group *Group) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "group")
	helper.Add("_id", group.id)
	helper.Add("parent", group.parent)
	helper.Add("display", group.display)
	helper.Add("rules", group.rules)

	return helper.Build()
}

func (group *Group) String() string {
	return group.Display()
}

func (group *Group) ToValues() *GroupValues {
	return &GroupValues{
		Id:      group.id,
		Parent:  group.parent,
		Display: group.display,
		Rules:   group.rules,
	}
}

type GroupValues struct {
	Id      string
	Parent  *string
	Display string
	Rules   []Rule
}

func NewGroup(values *GroupValues) *Group {
	return &Group{
		id:      values.Id,
		parent:  values.Parent,
		display: values.Display,
		rules:   values.Rules,
	}
}

type groupData struct {
	Id      bson.ObjectID  `bson:"_id"`
	Parent  *bson.ObjectID `bson:"parent"`
	Display string         `bson:"display"`
	Rules   []Rule         `bson:"rules"`
}

func groupEncode(group *Group) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(group.id)
	if err != nil {
		return nil, err
	}

	parent, err := nullableStringToObjectId(group.parent)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(groupData{
		Id:      id,
		Parent:  parent,
		Display: group.display,
		Rules:   group.rules,
	})
}

func groupDecode(raw []byte) (*Group, error) {
	data := groupData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	group := &Group{
		id:      data.Id.Hex(),
		parent:  nullableObjectIdToString(data.Parent),
		display: data.Display,
		rules:   data.Rules,
	}

	return group, nil
}
