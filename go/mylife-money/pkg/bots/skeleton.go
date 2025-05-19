package bots

import (
	"fmt"
	"mylife-money/pkg/entities"
)

type EventsRegistrationToken uint64

func RegisterBotRunEvents(start func(typ entities.BotType), end func(typ entities.BotType, result entities.BotRunResult), log func(typ entities.BotType, severity entities.BotRunLogSeverity, message string)) EventsRegistrationToken {
	// Register the events with the appropriate handlers
	// This is a placeholder for the actual implementation
	_ = start
	_ = end
	_ = log

	return EventsRegistrationToken(1)
}

func UnregisterBotRunEvents(token EventsRegistrationToken) {
	// Unregister the events using the provided token
	// This is a placeholder for the actual implementation
	_ = token
}

func StartBotRun(typ entities.BotType) error {
	// Start the bot run for the specified type
	// This is a placeholder for the actual implementation
	_ = typ

	return fmt.Errorf("not implemented")
}
