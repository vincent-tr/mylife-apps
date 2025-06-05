package amazonscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/business"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
	"regexp"
	"strings"
	"time"
)

type bot struct {
	mailFetcherConfig *common.MailFetcherConfig
	config            *common.MailScraperConfig

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

	if len(orders) == 0 {
		b.logger.Info("No new order found")
		return nil
	}

	b.logger.Info(fmt.Sprintf("Fetched %d orders", len(orders)))

	return common.RunEventLoopWithError("amazon-scraper/match-operations", func() error {
		operations, err := b.selectOperations(orders)
		if err != nil {
			return fmt.Errorf("failed to select operations: %w", err)
		}

		b.logger.Info(fmt.Sprintf("Found %d operations to match with orders", len(operations)))

		for _, order := range orders {
			// Only select operations that match the order date
			orderOperations := make([]*entities.Operation, 0)

			for _, op := range operations {
				if op.Date().After(order.Date.AddDate(0, 0, -b.config.MatchDaysDiff)) && op.Date().Before(order.Date.AddDate(0, 0, b.config.MatchDaysDiff)) {
					orderOperations = append(orderOperations, op)
				}
			}

			if err := b.processOrder(order, orderOperations); err != nil {
				b.logger.Error(fmt.Sprintf("Failed to process order %s: %s", order.Id, err))
			}
		}

		return nil
	})
}

var _ common.Bot = (*bot)(nil)

func NewBot(mailFetcherConfig *common.MailFetcherConfig, config *common.MailScraperConfig) common.Bot {
	return &bot{
		mailFetcherConfig: mailFetcherConfig,
		config:            config,
	}
}

func (b *bot) processOrder(order *order, operations []*entities.Operation) error {
	note := b.formatNote(order)

	for _, operation := range operations {
		if strings.Contains(operation.Note(), note) {
			b.logger.Debug(fmt.Sprintf("Order %s already processed in operation %s", order.Id, operation.Label()))
			return nil
		}
	}

	// Find operations that match the order

	// eg: March 6th = '0603'
	orderDate := fmt.Sprintf("%02d%02d", order.Date.Day(), order.Date.Month())
	pattern := strings.ReplaceAll(b.config.MatchLabel, "{date}", orderDate)
	matcher, err := regexp.Compile(pattern)
	if err != nil {
		return fmt.Errorf("failed to compile match label regex: %w", err)
	}

	results := make([]*entities.Operation, 0)

	for _, operation := range operations {
		if operation.Group() == nil && common.AmountsEqual(-operation.Amount(), order.Amount) && matcher.MatchString(operation.Label()) {
			results = append(results, operation)
		}
	}

	var operation *entities.Operation

	switch len(results) {
	case 0:
		b.logger.Info(fmt.Sprintf("No matching operation found for order %s (Date=%s, Amount=%.2f)", order.Id, order.Date.Format("02/01/2006"), order.Amount))

	case 1:
		b.logger.Info(fmt.Sprintf("Found matching operation %s for order %s", results[0].Id(), order.Id))
		operation = results[0]

	default:
		b.logger.Info(fmt.Sprintf("Found %d matching operations for order %s (Date=%s, Amount=%.2f)", len(results), order.Id, order.Date.Format("02/01/2006"), order.Amount))

	}

	if operation == nil {
		return nil
	}

	if err := business.OperationAppendNote(note, operation.Id()); err != nil {
		return fmt.Errorf("failed to append note to operation %s: %w", operation.Id(), err)
	}

	return nil
}

func (b *bot) selectOperations(orders []*order) ([]*entities.Operation, error) {
	account, err := business.GetAccountId(b.config.Account)
	if err != nil {
		return nil, fmt.Errorf("failed to get account %s: %w", b.config.Account, err)
	}

	minDate := time.Date(2100, 1, 1, 0, 0, 0, 0, time.UTC)
	maxDate := time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC)

	for _, order := range orders {
		if order.Date.Before(minDate) {
			minDate = order.Date
		}
		if order.Date.After(maxDate) {
			maxDate = order.Date
		}
	}

	minDate = minDate.AddDate(0, 0, -b.config.MatchDaysDiff)
	maxDate = maxDate.AddDate(0, 0, b.config.MatchDaysDiff)

	operations := business.OperationsListInterval(account, minDate, maxDate)

	return operations, nil
}

func (b *bot) formatNote(order *order) string {
	lines := []string{
		"**Commande Amazon**",
		"",
		fmt.Sprintf("[%s](https://www.amazon.fr/gp/your-account/order-details/ref?orderID=%s) le %s", order.Id, order.Id, order.Date.Format("02/01/2006")),
		"",
		"| | Produit | Qté | P.U. (EUR) |",
		"| - | - | - | - |",
	}

	for _, item := range order.Items {
		lines = append(lines, fmt.Sprintf("| [![img](%s)](%s) | [%s](%s) | %d | %.2f |",
			item.ImageUrl, item.ProductUrl, item.Name, item.ProductUrl, item.Quantity, item.UnitPrice))
	}

	return strings.Join(lines, "\n")
}
