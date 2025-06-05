package bots

import (
	"context"
	"fmt"
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
	"mylife-tools-server/services/monitor"
	"mylife-tools-server/services/tasks"
	"sync"
)

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

	execLogger := common.NewExecutionLogger(h.bot.Type())

	tasks.SubmitEventLoop("bots/run-start", func() {
		views.BotRunStarted(h.bot.Type())
	})

	err := h.bot.Run(h.ctx, execLogger)

	if err != nil {
		// This will raise the max severity in the logger
		execLogger.Fatalf("bot execution error: %s", err)
	}

	var result entities.BotRunResult
	var probeStatus monitor.ProbeStatus

	switch execLogger.GetMaxSeverity() {
	case entities.BotRunLogSeverityDebug, entities.BotRunLogSeverityInfo:
		result = entities.BotRunResultSuccess
		probeStatus = monitor.ProbeStatusOK
	case entities.BotRunLogSeverityWarning:
		result = entities.BotRunResultWarning
		probeStatus = monitor.ProbeStatusWarning
	case entities.BotRunLogSeverityError, entities.BotRunLogSeverityFatal:
		result = entities.BotRunResultError
		probeStatus = monitor.ProbeStatusCritical
	}

	tasks.SubmitEventLoop("bots/run-end", func() {
		views.BotRunEnded(h.bot.Type(), result)
	})

	monitor.SetProbeStatus(string(h.bot.Type()), probeStatus, "")

	// End of run
	h.mux.Lock()
	h.ctx = nil
	h.cancel = nil
	h.mux.Unlock()
}
