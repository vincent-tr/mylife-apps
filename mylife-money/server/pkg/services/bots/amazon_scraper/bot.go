package amazonscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
	"regexp"
	"strings"
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

	payments := make([]*common.Payment, 0, len(orders))

	for _, order := range orders {
		payments = append(payments, &common.Payment{
			Id:            order.Id,
			Date:          order.Date,
			Amount:        order.Amount,
			FormattedNote: b.formatNote(order),
		})
	}

	matcher := common.NewMailMatcher(b.logger, b.config, newOpMatcherFactory(b.config))

	return matcher.ProcessPayments(payments, entities.BotTypeAmazonScraper)
}

var _ common.Bot = (*bot)(nil)

func NewBot(mailFetcherConfig *common.MailFetcherConfig, config *common.MailScraperConfig) common.Bot {
	return &bot{
		mailFetcherConfig: mailFetcherConfig,
		config:            config,
	}
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

type opMatcher struct {
	matcher *regexp.Regexp
}

var _ common.OpMatcher = (*opMatcher)(nil)

func newOpMatcherFactory(config *common.MailScraperConfig) func(payment *common.Payment) (common.OpMatcher, error) {
	return func(payment *common.Payment) (common.OpMatcher, error) {
		// eg: March 6th = '0603'
		orderDate := fmt.Sprintf("%02d%02d", payment.Date.Day(), payment.Date.Month())
		pattern := strings.ReplaceAll(config.MatchLabel, "{date}", orderDate)
		matcher, err := regexp.Compile(pattern)
		if err != nil {
			return nil, fmt.Errorf("failed to compile match label regex: %w", err)
		}

		return &opMatcher{matcher}, nil
	}
}

func (m *opMatcher) MatchOperation(op *entities.Operation) bool {
	// DaysDiff and Amount are already checked by the matcher, only check the label
	return m.matcher.MatchString(op.Label())
}
