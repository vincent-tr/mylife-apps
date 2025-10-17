package bots

import (
	"fmt"
	"mylife-money/pkg/business"
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	amazonscraper "mylife-money/pkg/services/bots/amazon_scraper"
	cicscraper "mylife-money/pkg/services/bots/cic_scraper"
	"mylife-money/pkg/services/bots/common"
	paypalscraper "mylife-money/pkg/services/bots/paypal_scrapper"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/tasks"
	"sync"

	"github.com/go-co-op/gocron/v2"
)

var logger = log.CreateLogger("mylife:money:bots")

type Bot = common.Bot

type botsConfig struct {
	CicScraper    *cicscraper.Config        `mapstructure:"cic-scraper"`
	AmazonScraper *common.MailScraperConfig `mapstructure:"amazon-scraper"`
	PaypalScraper *common.MailScraperConfig `mapstructure:"paypal-scraper"`
	MailFetcher   *common.MailFetcherConfig `mapstructure:"mail-fetcher"`
}

type botsService struct {
	bots      map[entities.BotType]*botHandler
	pendings  *sync.WaitGroup
	scheduler gocron.Scheduler
}

func (service *botsService) Init(arg interface{}) error {
	conf := botsConfig{}
	config.BindStructure("bots", &conf)

	scheduler, err := gocron.NewScheduler()
	if err != nil {
		return nil
	}

	scheduler.Start()

	service.bots = make(map[entities.BotType]*botHandler)
	service.pendings = &sync.WaitGroup{}
	service.scheduler = scheduler

	if conf.CicScraper != nil {
		bot := cicscraper.NewBot(conf.CicScraper)
		service.initBot(bot)
	}

	if conf.AmazonScraper != nil {
		bot := amazonscraper.NewBot(conf.MailFetcher, conf.AmazonScraper)
		service.initBot(bot)
	}

	if conf.PaypalScraper != nil {
		bot := paypalscraper.NewBot(conf.MailFetcher, conf.PaypalScraper)
		service.initBot(bot)
	}

	business.SetBotStartHandler(service.startBotRun)

	return nil
}

func (service *botsService) Terminate() error {
	business.ResetBotStartHandler()

	if err := service.scheduler.Shutdown(); err != nil {
		return err
	}

	for _, bot := range service.bots {
		bot.Cancel()
	}

	service.pendings.Wait()

	return nil
}

func (service *botsService) initBot(bot common.Bot) {
	handler := newBotHandler(bot, service.pendings)
	service.bots[bot.Type()] = handler

	tasks.SubmitEventLoop("bots/add", func() {
		views.BotAdd(bot.Type(), bot.Schedule())
	})

	pschedule := bot.Schedule()
	if pschedule != nil {
		schedule := *pschedule
		service.scheduler.NewJob(gocron.CronJob(schedule, true), gocron.NewTask(handler.Start))
	}
}

func (service *botsService) ServiceName() string {
	return "bots"
}

func (service *botsService) Dependencies() []string {
	return []string{"secrets", "mail-sender", "store", "tasks", "monitor"}
}

func (service *botsService) startBotRun(typ entities.BotType) error {
	bot, ok := service.bots[typ]
	if !ok {
		return fmt.Errorf("bot %s not found", typ)
	}

	return bot.Start()

}

func init() {
	services.Register(&botsService{})
}

// Public access
