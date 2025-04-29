package entities

import (
	"mylife-tools-server/services/io/serialization"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
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
	Date     time.Time         `json:"date" bson:"date"` // TODO: does it work in io serialization?
	Severity BotRunLogSeverity `json:"severity" bson:"severity"`
	Message  string            `json:"message" bson:"message"`
}

// Execution de robot
type BotRun struct {
	id     string
	bot    string
	start  time.Time
	end    time.Time
	result BotRunResult
	logs   []BotRunLog
}

func (botRun *BotRun) Id() string {
	return botRun.id
}

// Robot
func (botRun *BotRun) Bot() string {
	return botRun.bot
}

// Début
func (botRun *BotRun) Start() time.Time {
	return botRun.start
}

// Fin
func (botRun *BotRun) End() time.Time {
	return botRun.end
}

// Résultat
func (botRun *BotRun) Result() BotRunResult {
	return botRun.result
}

// Logs
func (botRun *BotRun) Logs() []BotRunLog {
	return botRun.logs
}

func (botRun *BotRun) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "botRun")
	helper.Add("_id", botRun.id)
	helper.Add("bot", botRun.bot)
	helper.Add("start", botRun.start)
	helper.Add("end", botRun.end)
	helper.Add("result", botRun.result)
	helper.Add("logs", botRun.logs)

	return helper.Build()
}

type BotRunValues struct {
	Id     string
	Bot    string
	Start  time.Time
	End    time.Time
	Result BotRunResult
	Logs   []BotRunLog
}

func NewBotRun(values *BotRunValues) *BotRun {
	return &BotRun{
		id:     values.Id,
		bot:    values.Bot,
		start:  values.Start,
		end:    values.End,
		result: values.Result,
		logs:   values.Logs,
	}
}

type botRunData struct {
	Id     bson.ObjectID `bson:"_id"`
	Bot    bson.ObjectID `bson:"bot"`
	Start  time.Time     `bson:"start"`
	End    time.Time     `bson:"end"`
	Result BotRunResult  `bson:"result"`
	Logs   []BotRunLog   `bson:"logs"`
}

func BotRunEncode(botRun *BotRun) ([]byte, error) {
	id, err := bson.ObjectIDFromHex(botRun.id)
	if err != nil {
		return nil, err
	}

	bot, err := bson.ObjectIDFromHex(botRun.bot)
	if err != nil {
		return nil, err
	}

	return bson.Marshal(botRunData{
		Id:     id,
		Bot:    bot,
		Start:  botRun.start,
		End:    botRun.end,
		Result: botRun.result,
		Logs:   botRun.logs,
	})
}

func BotRunDecode(raw []byte) (*BotRun, error) {
	data := botRunData{}
	if err := bson.Unmarshal(raw, &data); err != nil {
		return nil, err
	}

	botRun := &BotRun{
		id:     data.Id.Hex(),
		bot:    data.Bot.Hex(),
		start:  data.Start,
		end:    data.End,
		result: data.Result,
		logs:   data.Logs,
	}

	return botRun, nil
}
