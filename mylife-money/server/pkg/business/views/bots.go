package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"time"
)

type botsView struct {
	container *store.Container[*entities.Bot]
}

func (view *botsView) AddListener(callback *func(event *store.Event[*entities.Bot])) {
	view.container.AddListener(callback)
}

func (view *botsView) RemoveListener(callback *func(event *store.Event[*entities.Bot])) {
	view.container.RemoveListener(callback)
}

func (view *botsView) Name() string {
	return view.container.Name()
}

func (view *botsView) Find(id string) (*entities.Bot, bool) {
	return view.container.Find(id)
}

func (view *botsView) Get(id string) (*entities.Bot, error) {
	return view.container.Get(id)
}

func (view *botsView) List() []*entities.Bot {
	return view.container.List()
}

func (view *botsView) Size() int {
	return view.container.Size()
}

func (view *botsView) Filter(predicate func(obj *entities.Bot) bool) []*entities.Bot {
	return view.container.Filter(predicate)
}

func (view *botsView) Exists(predicate func(obj *entities.Bot) bool) bool {
	return view.container.Exists(predicate)
}

func (view *botsView) Close() {
	botsViewInstance = nil
	view.container.Reset()
}

// avoid updates after closing
var botsViewInstance *botsView

func (view *botsView) Refresh() {
	// nothing to do
}

var _ store.IView[*entities.Bot] = (*botsView)(nil)

func NewBots() store.IView[*entities.Bot] {

	view := &botsView{}
	view.container = store.NewContainer[*entities.Bot]("bots")

	botsViewInstance = view

	return view
}

func (view *botsView) addBot(typ entities.BotType, schedule *string) {
	view.container.Set(entities.NewBot(&entities.BotValues{
		Id:       string(typ),
		Type:     typ,
		Schedule: schedule,
		LastRun:  nil,
	}))
}

func (view *botsView) botStart(typ entities.BotType) {
	view.updateBot(typ, func(values *entities.BotValues) {
		values.LastRun = &entities.BotRun{
			Start:  time.Now(),
			End:    nil,
			Result: nil,
			Logs:   make([]entities.BotRunLog, 0),
		}
	})
}

func (view *botsView) botEnd(typ entities.BotType, result entities.BotRunResult) {
	view.updateLastRun(typ, func(run *entities.BotRun) {
		endTime := time.Now()
		run.End = &endTime
		run.Result = &result
	})
}

func (view *botsView) botLog(typ entities.BotType, severity entities.BotRunLogSeverity, message string) {
	view.updateLastRun(typ, func(run *entities.BotRun) {
		run.Logs = append(run.Logs, entities.BotRunLog{
			Date:     time.Now(),
			Severity: severity,
			Message:  message,
		})
	})
}

func (view *botsView) updateBot(typ entities.BotType, updater func(*entities.BotValues)) {
	id := string(typ)

	err := tasks.SubmitEventLoop("energy/bot-update", func() {
		bot, ok := view.container.Find(id)
		if !ok {
			logger.Errorf("bot '%s' not found", id)
			return
		}

		values := bot.ToValues()

		updater(values)

		view.container.Set(entities.NewBot(values))

	})

	if err != nil {
		logger.WithError(err).Errorf("Failed to update bot '%s'", id)
		return
	}
}

func (view *botsView) updateLastRun(typ entities.BotType, updater func(*entities.BotRun)) {
	view.updateBot(typ, func(values *entities.BotValues) {
		if values.LastRun == nil {
			logger.Errorf("bot '%s' has no last run", typ)
			return
		}

		updater(values.LastRun)
	})
}

func BotAdd(typ entities.BotType, schedule *string) {
	if botsViewInstance == nil {
		panic("Bots view is not initialized")
	}

	botsViewInstance.addBot(typ, schedule)
}

func BotRunStarted(typ entities.BotType) {
	if botsViewInstance != nil {
		botsViewInstance.botStart(typ)
	}
}

func BotRunEnded(typ entities.BotType, result entities.BotRunResult) {
	if botsViewInstance != nil {
		botsViewInstance.botEnd(typ, result)
	}
}

func BotRunLog(typ entities.BotType, severity entities.BotRunLogSeverity, message string) {
	if botsViewInstance != nil {
		botsViewInstance.botLog(typ, severity, message)
	}
}
