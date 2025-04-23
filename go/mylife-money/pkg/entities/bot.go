package entities

import (
	"mylife-tools-server/services/io/serialization"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type BotType string

const (
	BotTypeNoop          BotType = "noop"
	BotTypeCicScraper    BotType = "cic-scraper"
	BotTypeFraisScraper  BotType = "frais-scraper"
	BotTypeAmazonScraper BotType = "amazon-scraper"
	BotTypePaypalScraper BotType = "paypal-scraper"
)

// Robot
type Bot struct {
	id            string
	typ           BotType
	name          string
	schedule      string
	configuration any
	state         any
}

func (bot *Bot) Id() string {
	return bot.id
}

// Type
func (bot *Bot) Type() BotType {
	return bot.typ
}

// Nom
func (bot *Bot) Name() string {
	return bot.name
}

// Planification
func (bot *Bot) Schedule() string {
	return bot.schedule
}

// Configuration
func (bot *Bot) Configuration() any {
	return bot.configuration
}

// Etat
func (bot *Bot) State() any {
	return bot.state
}

func (bot *Bot) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "bot")
	helper.Add("_id", bot.id)
	helper.Add("type", bot.typ)
	helper.Add("name", bot.name)
	helper.Add("schedule", bot.schedule)
	helper.Add("configuration", bot.configuration)
	helper.Add("state", bot.state)

	return helper.Build()
}

type BotValues struct {
	Id            string
	Type          BotType
	Name          string
	Schedule      string
	Configuration any
	State         any
}

func NewBot(values *BotValues) *Bot {
	return &Bot{
		id:            values.Id,
		typ:           values.Type,
		name:          values.Name,
		schedule:      values.Schedule,
		configuration: values.Configuration,
		state:         values.State,
	}
}

type botData struct {
	Id            bson.ObjectID `bson:"_id"`
	Type          BotType       `bson:"type"`
	Name          string        `bson:"name"`
	Schedule      string        `bson:"schedule"`
	Configuration any           `bson:"configuration"`
	State         any           `bson:"state"`
}

func botEncode(bot *Bot) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(bot.id)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(botData{
		Id:            id,
		Type:          bot.typ,
		Name:          bot.name,
		Schedule:      bot.schedule,
		Configuration: bot.configuration,
		State:         bot.state,
	})
}

func botDecode(raw []byte) (*Bot, error) {
	data := botData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	bot := &Bot{
		id:            data.Id.Hex(),
		typ:           data.Type,
		name:          data.Name,
		schedule:      data.Schedule,
		configuration: data.Configuration,
		state:         data.State,
	}

	return bot, nil
}
