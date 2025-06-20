package paypalscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
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

	payments := make([]*common.Payment, 0, len(receipts))

	for _, receipt := range receipts {
		payments = append(payments, &common.Payment{
			Id:            receipt.Id,
			Date:          receipt.Date,
			Amount:        receipt.Amount,
			FormattedNote: b.formatNote(receipt),
		})
	}

	matcher := common.NewMailMatcher(b.logger, b.config, newOpMatcher)

	return matcher.ProcessPayments(payments, entities.BotTypeAmazonScraper)
}

var _ common.Bot = (*bot)(nil)

func NewBot(mailFetcherConfig *common.MailFetcherConfig, config *common.MailScraperConfig) common.Bot {
	return &bot{
		mailFetcherConfig: mailFetcherConfig,
		config:            config,
	}
}

func (b *bot) formatNote(receipt *receipt) string {
	lines := []string{
		"**Reçu Paypal**",
		"",
		fmt.Sprintf("[%s](%s)", receipt.Id, receipt.Url),
		"",
	}

	// Transaction details
	for _, item := range receipt.Transaction {
		lines = append(lines, fmt.Sprintf("- %s : %s", item.Name, strings.Join(item.Value, " - ")))
	}
	lines = append(lines, "")

	// Items
	if len(receipt.Items) > 0 {
		lines = append(
			lines,
			"| Produit | Qté | P.U. | Montant |",
			"| - | - | - | - |",
		)

		for _, item := range receipt.Items {
			lines = append(lines, fmt.Sprintf("| %s | %d | %s | %s |",
				item.Description,
				item.Quantity,
				item.UnitPrice,
				item.Amount,
			))
		}

		lines = append(lines, "")
	}

	// Totals
	lines = append(
		lines,
		"Totaux",
		"",
	)

	for _, total := range receipt.Totals {
		lines = append(lines, fmt.Sprintf("- %s : %s", total.Name, total.Amount))
	}

	return strings.Join(lines, "\n")
}

type opMatcher struct {
}

var _ common.OpMatcher = (*opMatcher)(nil)

func newOpMatcher(_ *common.Payment) (common.OpMatcher, error) {
	return &opMatcher{}, nil
}

func (m *opMatcher) MatchOperation(op *entities.Operation) bool {
	// DaysDiff and Amount are already checked by the matcher, only check the label
	return strings.Contains(strings.ToLower(op.Label()), "paypal")
}
