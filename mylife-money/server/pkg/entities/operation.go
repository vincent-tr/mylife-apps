package entities

import (
	"fmt"
	"mylife-tools/services/io/serialization"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Operation
type Operation struct {
	id      string
	date    time.Time
	amount  float64
	label   string
	account string
	group   *string
	note    string
}

func (account *Operation) Id() string {
	return account.id
}

// Date
func (operation *Operation) Date() time.Time {
	return operation.date
}

// Montant
func (operation *Operation) Amount() float64 {
	return operation.amount
}

// Libellé
func (operation *Operation) Label() string {
	return operation.label
}

// Compte
func (operation *Operation) Account() string {
	return operation.account
}

// Groupe
func (operation *Operation) Group() *string {
	return operation.group
}

// Note
func (operation *Operation) Note() string {
	return operation.note
}

func (operation *Operation) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "operation")
	helper.Add("_id", operation.id)
	helper.Add("date", operation.date)
	helper.Add("amount", operation.amount)
	helper.Add("label", operation.label)
	helper.Add("account", operation.account)
	helper.Add("group", operation.group)
	helper.Add("note", operation.note)

	return helper.Build()
}

func (operation *Operation) String() string {
	return fmt.Sprintf("%s - %f (%s)", operation.date.Format("2006-01-02"), operation.amount, operation.label)
}

func (operation *Operation) ToValues() *OperationValues {
	return &OperationValues{
		Id:      operation.id,
		Date:    operation.date,
		Amount:  operation.amount,
		Label:   operation.label,
		Account: operation.account,
		Group:   operation.group,
		Note:    operation.note,
	}
}

type OperationValues struct {
	Id      string
	Date    time.Time
	Amount  float64
	Label   string
	Account string
	Group   *string
	Note    string
}

func NewOperation(values *OperationValues) *Operation {
	return &Operation{
		id:      values.Id,
		date:    values.Date,
		amount:  values.Amount,
		label:   values.Label,
		account: values.Account,
		group:   values.Group,
		note:    values.Note,
	}
}

type operationData struct {
	Id      bson.ObjectID  `bson:"_id"`
	Date    time.Time      `bson:"date"`
	Amount  float64        `bson:"amount"`
	Label   string         `bson:"label"`
	Account bson.ObjectID  `bson:"account"`
	Group   *bson.ObjectID `bson:"group"`
	Note    string         `bson:"note"`
}

func OperationEncode(operation *Operation) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(operation.id)
	if err != nil {
		return nil, err
	}

	account, err := bson.ObjectIDFromHex(operation.account)
	if err != nil {
		return nil, err
	}

	group, err := nullableStringToObjectId(operation.group)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(operationData{
		Id:      id,
		Date:    operation.date,
		Amount:  operation.amount,
		Label:   operation.label,
		Account: account,
		Group:   group,
		Note:    operation.note,
	})
}

func OperationDecode(raw []byte) (*Operation, error) {
	data := operationData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	operation := &Operation{
		id:      data.Id.Hex(),
		date:    data.Date,
		amount:  data.Amount,
		label:   data.Label,
		account: data.Account.Hex(),
		group:   nullableObjectIdToString(data.Group),
		note:    data.Note,
	}

	return operation, nil
}
