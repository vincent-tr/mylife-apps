package views

import (
	"mylife-money/pkg/bots"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"time"
)

type botsView struct {
	container         *store.Container[*entities.Bot]
	registrationToken bots.EventsRegistrationToken

	cicScraper *entities.Bot
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
	bots.UnregisterBotRunEvents(view.registrationToken)
	view.container.Reset()
}

func (view *botsView) Refresh() {
	// nothing to do
}

var _ store.IView[*entities.Bot] = (*botsView)(nil)

func NewBots() (store.IView[*entities.Bot], error) {

	view := &botsView{}
	view.container = store.NewContainer[*entities.Bot]("bots")
	view.registrationToken = bots.RegisterBotRunEvents(view.botStart, view.botEnd, view.botLog)

	///////

	schedule := "0 20 * * *"
	end := time.Date(2023, 10, 1, 20, 0, 0, 0, time.UTC)
	result := entities.BotRunResultSuccess

	view.cicScraper = entities.NewBot(&entities.BotValues{
		Id:       string(entities.BotTypeCicScraper),
		Type:     entities.BotTypeCicScraper,
		Schedule: &schedule,
		LastRun: &entities.BotRun{
			Start:  time.Date(2023, 10, 1, 20, 0, 0, 0, time.UTC),
			End:    &end,
			Result: &result,
		},
	})

	///////

	view.container.Set(view.cicScraper)

	return view, nil
}

func (view *botsView) botStart(typ entities.BotType) {
	// TODO
}

func (view *botsView) botEnd(typ entities.BotType, result entities.BotRunResult) {
	// TODO
}

func (view *botsView) botLog(typ entities.BotType, severity entities.BotRunLogSeverity, message string) {
	// TODO
}
