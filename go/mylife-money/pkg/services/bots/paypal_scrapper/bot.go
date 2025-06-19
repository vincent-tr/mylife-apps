package paypalscraper

import (
	"context"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
)

type bot struct {
	mailFetcherConfig *common.MailFetcherConfig
	config            *common.MailScraperConfig

	// only set when the bot is running
	ctx    context.Context
	logger *common.ExecutionLogger
}

func (b *bot) Type() entities.BotType {
	return entities.BotTypePaypalScraper
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

	receipts, err := b.fetchReceipts()
	if err != nil {
		return err
	}

	if len(receipts) == 0 {
		b.logger.Info("No new receipt found")
		return nil
	}

	return nil
}

var _ common.Bot = (*bot)(nil)

func NewBot(mailFetcherConfig *common.MailFetcherConfig, config *common.MailScraperConfig) common.Bot {
	return &bot{
		mailFetcherConfig: mailFetcherConfig,
		config:            config,
	}
}
