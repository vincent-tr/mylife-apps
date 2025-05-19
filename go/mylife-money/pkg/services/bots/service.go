package bots

import (
	"fmt"
	"mylife-money/pkg/entities"
	cicscraper "mylife-money/pkg/services/bots/cic-scraper"
	"mylife-money/pkg/services/bots/common"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
)

var logger = log.CreateLogger("mylife:money:bots")

type EventsRegistrationToken = common.EventsRegistrationToken
type Bot = common.Bot

type botsConfig struct {
	CicScraper *cicscraper.Config `mapstructure:"cic-scraper"`
}

type botsService struct {
	notifications *common.NotificationsDispatcher

	bots []common.Bot
}

func (service *botsService) Init(arg interface{}) error {
	conf := botsConfig{}
	config.BindStructure("bots", &conf)

	service.notifications = common.NewNotificationsDispatcher()

	service.bots = make([]common.Bot, 0)

	if conf.CicScraper != nil {
		bot := cicscraper.NewBot(conf.CicScraper)
		service.bots = append(service.bots, bot)
	}

	return nil
}

func (service *botsService) Terminate() error {

	return nil
}

func (service *botsService) ServiceName() string {
	return "bots"
}

func (service *botsService) Dependencies() []string {
	return []string{"secrets"}
}

func (service *botsService) startBotRun(typ entities.BotType) error {
	return fmt.Errorf("not implemented")
}

func (service *botsService) getBots() []common.Bot {
	bots := make([]common.Bot, len(service.bots))
	copy(bots, service.bots)
	return bots
}

func init() {
	services.Register(&botsService{})
}

func getService() *botsService {
	return services.GetService[*botsService]("bots")
}

// Public access

func RegisterBotRunEvents(start func(typ entities.BotType), end func(typ entities.BotType, result entities.BotRunResult), log func(typ entities.BotType, severity entities.BotRunLogSeverity, message string)) EventsRegistrationToken {
	return getService().notifications.RegisterBotRunEvents(start, end, log)
}

func UnregisterBotRunEvents(token EventsRegistrationToken) {
	getService().notifications.UnregisterBotRunEvents(token)
}

func StartBotRun(typ entities.BotType) error {
	return getService().startBotRun(typ)
}

func GetBots() []Bot {
	return getService().getBots()
}
