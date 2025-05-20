package cicscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
)

type Config struct {
	Schedule *string `mapstructure:"schedule"`
	User     string  `mapstructure:"user"`
	Pass     string  `mapstructure:"pass"`
	Account  string  `mapstructure:"account"`
}

type bot struct {
	config *Config

	// only set when the bot is running
	ctx    context.Context
	logger *common.ExecutionLogger
}

func (b *bot) Type() entities.BotType {
	return entities.BotTypeCicScraper
}

func (b *bot) Schedule() *string {
	return b.config.Schedule
}

func (b *bot) Run(ctx context.Context, logger *common.ExecutionLogger) error {
	b.ctx = ctx
	b.logger = logger
	defer func() {
		b.ctx = nil
		b.logger = nil
	}()

	return fmt.Errorf("not implemented")
}

var _ common.Bot = (*bot)(nil)

func NewBot(config *Config) common.Bot {
	return &bot{
		config: config,
	}
}
