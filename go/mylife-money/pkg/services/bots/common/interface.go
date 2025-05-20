package common

import (
	"context"
	"mylife-money/pkg/entities"
)

type Bot interface {
	Type() entities.BotType
	Schedule() *string

	Run(ctx context.Context, logger *ExecutionLogger) error
}
