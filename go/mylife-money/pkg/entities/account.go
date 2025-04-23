package entities

import (
	"mylife-tools-server/services/io/serialization"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Account
type Account struct {
	id      string
	code    string
	display string
}

func (account *Account) Id() string {
	return account.id
}

// Code
func (account *Account) Code() string {
	return account.code
}

// Affichage
func (account *Account) Display() string {
	return account.display
}

func (account *Account) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "account")
	helper.Add("_id", account.id)
	helper.Add("code", account.code)
	helper.Add("display", account.display)

	return helper.Build()
}

func (account *Account) String() string {
	return account.Display()
}

type AccountValues struct {
	Id      string
	Code    string
	Display string
}

func NewAccount(values *AccountValues) *Account {
	return &Account{
		id:      values.Id,
		code:    values.Code,
		display: values.Display,
	}
}

type accountData struct {
	Id      bson.ObjectID `bson:"_id"`
	Code    string        `bson:"code"`
	Display string        `bson:"display"`
}

func accountEncode(account *Account) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(account.id)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(accountData{
		Id:      id,
		Code:    account.code,
		Display: account.display,
	})
}

func accountDecode(raw []byte) (*Account, error) {
	data := accountData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	account := &Account{
		id:      data.Id.Hex(),
		code:    data.Code,
		display: data.Display,
	}

	return account, nil
}
