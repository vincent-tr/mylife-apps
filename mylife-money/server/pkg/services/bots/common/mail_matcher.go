package common

import (
	"fmt"
	"mylife-money/pkg/business"
	"mylife-money/pkg/entities"
	"strings"
	"time"
)

// Payment represents a payment object that can be matched with operations.
// If matched, it will be used to update the operation's note.
type Payment struct {
	// Id of the object
	Id string

	// Date of data
	Date time.Time

	// Amount
	Amount float64

	// Note to add to operation
	FormattedNote string
}

type OpMatcher interface {
	MatchOperation(op *entities.Operation) bool
}

type MailMatcher struct {
	logger        *ExecutionLogger
	config        *MailScraperConfig
	createMatcher func(payment *Payment) (OpMatcher, error)
}

func NewMailMatcher(
	logger *ExecutionLogger,
	config *MailScraperConfig,
	matcherFactory func(payment *Payment) (OpMatcher, error),
) *MailMatcher {
	return &MailMatcher{
		logger:        logger,
		config:        config,
		createMatcher: matcherFactory,
	}
}

func (mm *MailMatcher) ProcessPayments(payments []*Payment, botType entities.BotType) error {
	if len(payments) == 0 {
		logger.Info("No new payment found")
		return nil
	}

	logger.Info(fmt.Sprintf("Fetched %d payments", len(payments)))

	return RunEventLoopWithError(string(botType)+"/match-payments", func() error {
		operations, err := mm.selectOperations(payments)
		if err != nil {
			return fmt.Errorf("failed to select operations: %w", err)
		}

		logger.Info(fmt.Sprintf("Found %d operations to match with payments", len(operations)))

		for _, payment := range payments {
			// Only select operations that match the payment date
			orderOperations := make([]*entities.Operation, 0)

			for _, op := range operations {
				if op.Date().After(payment.Date.AddDate(0, 0, -mm.config.MatchDaysDiff)) && op.Date().Before(payment.Date.AddDate(0, 0, mm.config.MatchDaysDiff)) {
					orderOperations = append(orderOperations, op)
				}
			}

			if err := mm.processPayment(payment, orderOperations); err != nil {
				logger.Error(fmt.Sprintf("Failed to process payment %s: %s", payment.Id, err))
			}
		}

		return nil
	})
}

func (mm *MailMatcher) processPayment(payment *Payment, operations []*entities.Operation) error {
	for _, operation := range operations {
		if strings.Contains(operation.Note(), payment.FormattedNote) {
			mm.logger.Debug(fmt.Sprintf("Order %s already processed in operation %s", payment.Id, operation.Label()))
			return nil
		}
	}

	// Find operations that match the payment
	matcher, err := mm.createMatcher(payment)
	if err != nil {
		return fmt.Errorf("failed to create matcher: %w", err)
	}

	results := make([]*entities.Operation, 0)

	for _, operation := range operations {
		if operation.Group() == nil && AmountsEqual(-operation.Amount(), payment.Amount) && matcher.MatchOperation(operation) {
			results = append(results, operation)
		}
	}

	var operation *entities.Operation

	switch len(results) {
	case 0:
		mm.logger.Info(fmt.Sprintf("No matching operation found for payment %s (Date=%s, Amount=%.2f)", payment.Id, payment.Date.Format("02/01/2006"), payment.Amount))

	case 1:
		mm.logger.Info(fmt.Sprintf("Found matching operation %s for payment %s", results[0].Id(), payment.Id))
		operation = results[0]

	default:
		mm.logger.Info(fmt.Sprintf("Found %d matching operations for payment %s (Date=%s, Amount=%.2f)", len(results), payment.Id, payment.Date.Format("02/01/2006"), payment.Amount))

	}

	if operation == nil {
		return nil
	}

	if err := business.OperationAppendNote(payment.FormattedNote, operation.Id()); err != nil {
		return fmt.Errorf("failed to append note to operation %s: %w", operation.Id(), err)
	}

	return nil
}

func (mm *MailMatcher) selectOperations(payments []*Payment) ([]*entities.Operation, error) {
	account, err := business.GetAccountId(mm.config.Account)
	if err != nil {
		return nil, fmt.Errorf("failed to get account %s: %w", mm.config.Account, err)
	}

	minDate := time.Date(2100, 1, 1, 0, 0, 0, 0, time.UTC)
	maxDate := time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC)

	for _, payment := range payments {
		if payment.Date.Before(minDate) {
			minDate = payment.Date
		}
		if payment.Date.After(maxDate) {
			maxDate = payment.Date
		}
	}

	minDate = minDate.AddDate(0, 0, -mm.config.MatchDaysDiff)
	maxDate = maxDate.AddDate(0, 0, mm.config.MatchDaysDiff)

	operations := business.OperationsListInterval(account, minDate, maxDate)

	return operations, nil
}
