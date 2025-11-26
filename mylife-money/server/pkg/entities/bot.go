package entities

import (
	"mylife-tools/services/io/serialization"
	"time"
)

type BotType string

const (
	BotTypeCicScraper    BotType = "cic-scraper"
	BotTypeFraisScraper  BotType = "frais-scraper"
	BotTypeAmazonScraper BotType = "amazon-scraper"
	BotTypePaypalScraper BotType = "paypal-scraper"
)

type BotRunResult string

const (
	BotRunResultSuccess BotRunResult = "success"
	BotRunResultWarning BotRunResult = "warning"
	BotRunResultError   BotRunResult = "error"
)

type BotRunLogSeverity string

const (
	BotRunLogSeverityDebug   BotRunLogSeverity = "debug"
	BotRunLogSeverityInfo    BotRunLogSeverity = "info"
	BotRunLogSeverityWarning BotRunLogSeverity = "warning"
	BotRunLogSeverityError   BotRunLogSeverity = "error"
	BotRunLogSeverityFatal   BotRunLogSeverity = "fatal"
)

type BotRunLog struct {
	Date     time.Time         `json:"date"`
	Severity BotRunLogSeverity `json:"severity"`
	Message  string            `json:"message"`
}

// Execution de robot
type BotRun struct {
	Start  time.Time     `json:"start"`
	End    *time.Time    `json:"end"`
	Result *BotRunResult `json:"result"`
	Logs   []BotRunLog   `json:"logs"`
}

// Robot
type Bot struct {
	id       string
	typ      BotType
	schedule *string
	lastRun  *BotRun
}

func (bot *Bot) Id() string {
	return bot.id
}

// Type
func (bot *Bot) Type() BotType {
	return bot.typ
}

// Planification
func (bot *Bot) Schedule() *string {
	return bot.schedule
}

// Dernière exécution
func (bot *Bot) LastRun() *BotRun {
	return bot.lastRun
}

func (bot *Bot) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "bot")
	helper.Add("_id", bot.id)
	helper.Add("type", bot.typ)
	helper.Add("schedule", bot.schedule)
	helper.Add("lastRun", bot.lastRun)

	return helper.Build()
}

func (bot *Bot) String() string {
	return string(bot.typ)
}

func (bot *Bot) ToValues() *BotValues {
	return &BotValues{
		Id:       bot.id,
		Type:     bot.typ,
		Schedule: bot.schedule,
		LastRun:  bot.lastRun,
	}
}

type BotValues struct {
	Id       string
	Type     BotType
	Schedule *string
	LastRun  *BotRun
}

func NewBot(values *BotValues) *Bot {
	return &Bot{
		id:       values.Id,
		typ:      values.Type,
		schedule: values.Schedule,
		lastRun:  values.LastRun,
	}
}
