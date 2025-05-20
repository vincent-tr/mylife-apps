package cicscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
	"net/http"
	"net/http/cookiejar"
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
	client *http.Client
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

	jar, err := cookiejar.New(nil)
	if err != nil {
		return fmt.Errorf("failed to create cookie jar: %w", err)
	}

	b.client = &http.Client{}
	b.client.Jar = jar
	defer func() {
		if b.client != nil {
			b.client.CloseIdleConnections()
		}
		b.client = nil
	}()

	if err := b.authenticate(); err != nil {
		return fmt.Errorf("failed to authenticate: %w", err)
	}

	data, err := b.download()
	if err != nil {
		return fmt.Errorf("failed to download: %w", err)
	}

	_ = data
	return fmt.Errorf("not implemented")
}

var _ common.Bot = (*bot)(nil)

func NewBot(config *Config) common.Bot {
	return &bot{
		config: config,
	}
}
