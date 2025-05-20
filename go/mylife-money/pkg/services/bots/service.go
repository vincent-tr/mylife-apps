package bots

import (
	"context"
	"fmt"
	"mylife-money/pkg/entities"
	cicscraper "mylife-money/pkg/services/bots/cic-scraper"
	"mylife-money/pkg/services/bots/common"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"sync"
)

var logger = log.CreateLogger("mylife:money:bots")

type EventsRegistrationToken = common.EventsRegistrationToken
type Bot = common.Bot

type botsConfig struct {
	CicScraper *cicscraper.Config `mapstructure:"cic-scraper"`
}

type botHandler struct {
	bot common.Bot
	wg  *sync.WaitGroup

	ctx    context.Context
	cancel func()
	mux    sync.Mutex
}

func newBotHandler(bot common.Bot, wg *sync.WaitGroup) *botHandler {
	return &botHandler{
		bot: bot,
		wg:  wg,
	}
}

func (h *botHandler) Type() entities.BotType {
	return h.bot.Type()
}

func (h *botHandler) Schedule() *string {
	return h.bot.Schedule()
}

func (h *botHandler) IsRunning() bool {
	h.mux.Lock()
	defer h.mux.Unlock()

	return h.ctx != nil
}

func (h *botHandler) Cancel() {
	cancel := h.cancel
	if cancel != nil {
		cancel()
	}
}

func (h *botHandler) Start() error {
	h.mux.Lock()
	defer h.mux.Unlock()

	if h.ctx != nil {
		return fmt.Errorf("bot %s is already running", h.bot.Type())
	}

	ctx, cancel := context.WithCancel(context.Background())
	h.ctx = ctx
	h.cancel = cancel

	h.wg.Add(1)

	go h.Execute()

	return nil
}

func (h *botHandler) Execute() {
	defer h.wg.Done()

	disp := getService().notifications
	execLogger := common.NewExecutionLogger(h.bot.Type(), disp)

	disp.EmitStart(h.bot.Type())

	err := h.bot.Run(h.ctx, execLogger)

	if err != nil {
		// This will raise the max severity in the logger
		execLogger.Fatalf("bot execution error: %s", err)
	}

	var result entities.BotRunResult

	switch execLogger.GetMaxSeverity() {
	case entities.BotRunLogSeverityDebug, entities.BotRunLogSeverityInfo:
		result = entities.BotRunResultSuccess
	case entities.BotRunLogSeverityWarning:
		result = entities.BotRunResultWarning
	case entities.BotRunLogSeverityError, entities.BotRunLogSeverityFatal:
		result = entities.BotRunResultError
	}

	disp.EmitEnd(h.bot.Type(), result)

	// End of run
	h.mux.Lock()
	h.ctx = nil
	h.cancel = nil
	h.mux.Unlock()
}

type botsService struct {
	notifications *common.NotificationsDispatcher

	bots     []*botHandler
	pendings *sync.WaitGroup
}

func (service *botsService) Init(arg interface{}) error {
	conf := botsConfig{}
	config.BindStructure("bots", &conf)

	service.notifications = common.NewNotificationsDispatcher()

	service.bots = make([]*botHandler, 0)

	if conf.CicScraper != nil {
		bot := cicscraper.NewBot(conf.CicScraper)
		service.bots = append(service.bots, newBotHandler(bot, service.pendings))
	}

	service.pendings = &sync.WaitGroup{}

	return nil
}

func (service *botsService) Terminate() error {
	for _, bot := range service.bots {
		bot.Cancel()
	}

	service.pendings.Wait()

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

	for i, bot := range service.bots {
		bots[i] = bot.bot
	}

	return bots
}

func init() {
	services.Register(&botsService{})
}

func getService() *botsService {
	return services.GetService[*botsService]("bots")
}

// Public access

func GetNotificationsDispatcher() *common.NotificationsDispatcher {
	return getService().notifications
}

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
