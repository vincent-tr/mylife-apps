package cicscraper

import (
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
}

func (b *bot) IsRunning() bool {
	panic("unimplemented")
}

func (b *bot) Schedule() *string {
	return b.config.Schedule
}

func (b *bot) Start() error {
	return fmt.Errorf("unimplemented")
}

func (b *bot) Type() entities.BotType {
	return entities.BotTypeCicScraper
}

var _ common.Bot = (*bot)(nil)

func NewBot(config *Config) common.Bot {
	return &bot{
		config: config,
	}
}
