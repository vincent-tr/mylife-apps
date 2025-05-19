package common

import (
	"maps"
	"mylife-money/pkg/entities"
	"slices"
	"sync"
)

type EventsRegistrationToken uint64

type NotificationsDispatcher struct {
	handlers  map[EventsRegistrationToken]*notificationsHandler
	idCounter uint64
	mux       sync.Mutex
}

type notificationsHandler struct {
	start func(typ entities.BotType)
	end   func(typ entities.BotType, result entities.BotRunResult)
	log   func(typ entities.BotType, severity entities.BotRunLogSeverity, message string)
}

func NewNotificationsDispatcher() *NotificationsDispatcher {
	return &NotificationsDispatcher{
		handlers:  make(map[EventsRegistrationToken]*notificationsHandler),
		idCounter: 0,
	}
}

func (disp *NotificationsDispatcher) RegisterBotRunEvents(start func(typ entities.BotType), end func(typ entities.BotType, result entities.BotRunResult), log func(typ entities.BotType, severity entities.BotRunLogSeverity, message string)) EventsRegistrationToken {
	disp.mux.Lock()
	defer disp.mux.Unlock()
	disp.idCounter++
	token := EventsRegistrationToken(disp.idCounter)

	disp.handlers[token] = &notificationsHandler{
		start: start,
		end:   end,
		log:   log,
	}

	return token
}

func (disp *NotificationsDispatcher) UnregisterBotRunEvents(token EventsRegistrationToken) {
	disp.mux.Lock()
	defer disp.mux.Unlock()

	delete(disp.handlers, token)
}

func (disp *NotificationsDispatcher) getHandlers() []*notificationsHandler {
	disp.mux.Lock()
	defer disp.mux.Unlock()

	return slices.Collect(maps.Values(disp.handlers))
}

func (disp *NotificationsDispatcher) EmitStart(typ entities.BotType) {
	handlers := disp.getHandlers()

	for _, handler := range handlers {
		if handler.start != nil {
			handler.start(typ)
		}
	}
}

func (disp *NotificationsDispatcher) EmitEnd(typ entities.BotType, result entities.BotRunResult) {
	handlers := disp.getHandlers()

	for _, handler := range handlers {
		if handler.end != nil {
			handler.end(typ, result)
		}
	}
}

func (disp *NotificationsDispatcher) EmitLog(typ entities.BotType, severity entities.BotRunLogSeverity, message string) {
	handlers := disp.getHandlers()

	for _, handler := range handlers {
		if handler.log != nil {
			handler.log(typ, severity, message)
		}
	}
}
