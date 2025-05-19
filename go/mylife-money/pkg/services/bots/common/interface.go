package common

import "mylife-money/pkg/entities"

type Bot interface {
	Type() entities.BotType
	Schedule() *string
	IsRunning() bool

	Start() error
}
