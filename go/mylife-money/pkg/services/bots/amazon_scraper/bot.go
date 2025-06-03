package amazonscraper

import (
	"context"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
)

type Config struct {
	Schedule      *string `mapstructure:"schedule"`
	Mailbox       string  `mapstructure:"mailbox"`
	From          string  `mapstructure:"from"`    // optional
	Subject       string  `mapstructure:"subject"` // optional
	SinceDays     int     `mapstructure:"since-days"`
	account       string  `mapstructure:"account"`
	matchDaysDiff int     `mapstructure:"match-days-diff"`
	matchLabel    string  `mapstructure:"match-label"`
	template      string  `mapstructure:"template"`
}

type bot struct {
	mailFetcherConfig *common.MailFetcherConfig
	config            *Config

	// only set when the bot is running
	ctx    context.Context
	logger *common.ExecutionLogger
}

func (b *bot) Type() entities.BotType {
	return entities.BotTypeAmazonScraper
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

	orders, err := b.fetchOrders()
	if err != nil {
		return err
	}

	_ = orders

	return nil
}

var _ common.Bot = (*bot)(nil)

func NewBot(mailFetcherConfig *common.MailFetcherConfig, config *Config) common.Bot {
	return &bot{
		mailFetcherConfig: mailFetcherConfig,
		config:            config,
	}
}
