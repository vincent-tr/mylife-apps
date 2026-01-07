package business

import (
	"encoding/csv"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools/services/store"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type record struct {
	date    time.Time
	amount  float64
	label   string
	account string
}

func OperationsImport(account string, data string) (int, error) {

	records, err := parseRecords(account, data)
	if err != nil {
		return 0, err
	}

	records = filterExisting(records)
	insertRecords(records)

	logger.Infof("Import done, %d operations added", len(records))
	return len(records), nil
}

func parseRecords(account string, data string) ([]record, error) {
	reader := csv.NewReader(strings.NewReader(data))
	reader.Comma = ';'
	reader.FieldsPerRecord = 6

	// Skip 1 header line
	if _, err := reader.Read(); err != nil {
		return nil, fmt.Errorf("error reading header: %w", err)
	}

	records := make([]record, 0)

	for {
		raw, err := reader.Read()
		if err != nil {
			break
		}

		record, err := parseRecord(account, raw)
		if err != nil {
			return nil, fmt.Errorf("error parsing record: %w (record: '%v')", err, raw)
		}

		records = append(records, record)
	}

	return records, nil
}

func parseRecord(account string, input []string) (record, error) {
	if len(input) != 6 {
		return record{}, fmt.Errorf("invalid input length: expected 6, got %d", len(input))
	}

	rawOpDate, rawValDate, rawDebit, rawCredit, rawLabel, rawBalance := input[0], input[1], input[2], input[3], input[4], input[5]

	opDate, err := parseDate(rawOpDate)
	if err != nil {
		return record{}, fmt.Errorf("error parsing operation date: %w", err)
	}

	valDate, err := parseDate(rawValDate)
	if err != nil {
		return record{}, fmt.Errorf("error parsing value date: %w", err)
	}

	debit, err := parseNumber(rawDebit)
	if err != nil {
		return record{}, fmt.Errorf("error parsing debit: %w", err)
	}

	credit, err := parseNumber(rawCredit)
	if err != nil {
		return record{}, fmt.Errorf("error parsing credit: %w", err)
	}

	label := rawLabel

	balance, err := parseNumber(rawBalance)
	if err != nil {
		return record{}, fmt.Errorf("error parsing balance: %w", err)
	}

	amount := 0.0
	if debit != 0 {
		amount = debit
	} else if credit != 0 {
		amount = credit
	} else {
		logger.Warnf("Record with no debit or credit: '%v'", input)
	}

	_ = valDate
	_ = balance

	return record{
		date:    opDate,
		amount:  amount,
		label:   label,
		account: account,
	}, nil
}

func parseNumber(input string) (float64, error) {
	if input == "" {
		return 0, nil
	}

	input = strings.ReplaceAll(input, ",", ".")
	return strconv.ParseFloat(input, 64)
}

func parseDate(input string) (time.Time, error) {
	return time.Parse("02/01/2006", input)
}

func findLastOperation() *entities.Operation {
	operations := store.GetCollection[*entities.Operation]("operations")

	var lastOperation *entities.Operation

	for _, operation := range operations.List() {
		if lastOperation == nil || operation.Date().After(lastOperation.Date()) {
			lastOperation = operation
		}
	}

	return lastOperation
}

func filterExisting(records []record) []record {
	operations := store.GetCollection[*entities.Operation]("operations")
	lastOperation := findLastOperation()

	if lastOperation == nil {
		return records
	}

	lastOperationDate := lastOperation.Date()
	lastDayOperations := operations.Filter(func(op *entities.Operation) bool {
		return op.Date().Equal(lastOperationDate)
	})

	opHashSet := make(map[string]bool)
	for _, op := range lastDayOperations {
		opHashSet[fmt.Sprintf("%.2f|%s|%s", op.Amount(), op.Account(), op.Label())] = true
	}

	filteredRecords := make([]record, 0)

	for _, rec := range records {
		if rec.date.Before(lastOperationDate) {
			continue
		}

		if rec.date.After(lastOperationDate) {
			filteredRecords = append(filteredRecords, rec)
			continue
		}

		recHash := fmt.Sprintf("%.2f|%s|%s", rec.amount, rec.account, rec.label)
		if !opHashSet[recHash] {
			filteredRecords = append(filteredRecords, rec)
		}
	}

	return filteredRecords
}

func insertRecords(records []record) {
	operations := store.GetCollection[*entities.Operation]("operations")

	for _, record := range records {
		values := &entities.OperationValues{
			Id:      operations.NewId(),
			Date:    record.date,
			Amount:  record.amount,
			Label:   record.label,
			Account: record.account,
		}

		operations.Set(entities.NewOperation(values))
	}
}

func ExecuteRules() (int, error) {
	logger.Info("Executing rules")

	operations := store.GetCollection[*entities.Operation]("operations")
	groups := store.GetCollection[*entities.Group]("groups")

	unsortedOperations := operations.Filter(func(op *entities.Operation) bool {
		return op.Group() == nil
	})

	rulesExecutor, err := buildRulesExecutor(groups.List())
	if err != nil {
		return 0, err
	}

	opCount := 0

	for _, operation := range unsortedOperations {
		group, err := rulesExecutor.Execute(operation)
		if err != nil {
			logger.Errorf("Error executing rules for operation %s: %v", operation.Id(), err)
			continue
		}

		if group == nil {
			continue
		}

		logger.Infof("Moving operation %s to group %s (%s)", operation.Id(), group.Id(), group.Display())

		values := operation.ToValues()
		id := group.Id()
		values.Group = &id
		operations.Set(entities.NewOperation(values))

		opCount++
	}

	logger.Infof("Execution done, moved %d operations", opCount)

	return opCount, nil
}

type rulesExecutor struct {
	rules []*rule
}

func buildRulesExecutor(groups []*entities.Group) (*rulesExecutor, error) {
	rules := make([]*rule, 0)

	for _, group := range groups {
		if group.Rules() == nil {
			continue
		}

		for _, rule := range group.Rules() {
			rule, err := makeRule(group, rule.Conditions)
			if err != nil {
				return nil, fmt.Errorf("error creating rule: %w", err)
			}

			rules = append(rules, rule)
		}
	}

	return &rulesExecutor{rules: rules}, nil
}

func (re *rulesExecutor) Execute(operation *entities.Operation) (*entities.Group, error) {
	for _, rule := range re.rules {
		group, err := rule.Execute(operation)
		if err != nil {
			return nil, fmt.Errorf("error executing rule: %w", err)
		}

		if group != nil {
			return group, nil
		}
	}

	return nil, nil
}

type rule struct {
	group *entities.Group
	items []ruleItem
}

type ruleItem struct {
	getter fieldGetter
	value  any
	op     operator
}

func makeRule(group *entities.Group, conditions []entities.Condition) (*rule, error) {
	items := make([]ruleItem, 0, len(conditions))

	for _, condition := range conditions {
		getter, ok := fieldGetters[condition.Field]
		if !ok {
			return nil, fmt.Errorf("unknown field: %s", condition.Field)
		}

		op, ok := operators[condition.Operator]
		if !ok {
			return nil, fmt.Errorf("unknown operator: %s", condition.Operator)
		}

		items = append(items, ruleItem{
			getter: getter,
			value:  condition.Value,
			op:     op,
		})
	}

	return &rule{
		group,
		items,
	}, nil
}

func (r *rule) Execute(operation *entities.Operation) (*entities.Group, error) {
	// No items means never match
	if r.items == nil || len(r.items) == 0 {
		return nil, nil
	}

	for _, item := range r.items {
		field := item.getter(operation)
		result, err := item.op(field, item.value)
		if err != nil {
			return nil, fmt.Errorf("error executing operator for rule of group '%s': %w", r.group.Display(), err)
		}

		if !result {
			return nil, nil
		}
	}

	return r.group, nil
}

type fieldGetter = func(operation *entities.Operation) any

var fieldGetters = map[string]fieldGetter{
	"amount": func(operation *entities.Operation) any {
		return operation.Amount()
	},
	"label": func(operation *entities.Operation) any {
		return operation.Label()
	},
	"note": func(operation *entities.Operation) any {
		return operation.Note()
	},
}

type operator = func(field any, value any) (bool, error)

var operators = map[entities.RuleOperator]operator{
	"$eq": func(field any, value any) (bool, error) {
		switch typedField := field.(type) {
		case float64:
			typedValue, ok := value.(float64)
			if !ok {
				return false, fmt.Errorf("value is not a float64")
			}
			return typedField == typedValue, nil

		case string:
			typedValue, ok := value.(string)
			if !ok {
				return false, fmt.Errorf("value is not a string")
			}
			return typedField == typedValue, nil

		default:
			return false, fmt.Errorf("field is not a string or float64")
		}
	},
	"$lt": makeNumberOperator(func(field float64, value float64) (bool, error) {
		return field < value, nil
	}),
	"$lte": makeNumberOperator(func(field float64, value float64) (bool, error) {
		return field <= value, nil
	}),
	"$gt": makeNumberOperator(func(field float64, value float64) (bool, error) {
		return field > value, nil
	}),
	"$gte": makeNumberOperator(func(field float64, value float64) (bool, error) {
		return field >= value, nil
	}),
	"$regex": makeStringOperator(func(field string, value string) (bool, error) {
		regexp, err := regexp.Compile(value)
		if err != nil {
			return false, fmt.Errorf("error compiling regex: %w", err)
		}
		return regexp.MatchString(field), nil
	}),
	"$contains": makeStringOperator(func(field string, value string) (bool, error) {
		return strings.Contains(field, value), nil
	}),
}

func makeNumberOperator(impl func(field float64, value float64) (bool, error)) operator {
	return func(field any, value any) (bool, error) {
		typedField, ok := field.(float64)
		if !ok {
			return false, fmt.Errorf("field is not a float64")
		}

		typedValue, ok := value.(float64)
		if !ok {
			return false, fmt.Errorf("value is not a float64")
		}

		return impl(typedField, typedValue)
	}
}

func makeStringOperator(impl func(field string, value string) (bool, error)) operator {
	return func(field any, value any) (bool, error) {
		typedField, ok := field.(string)
		if !ok {
			return false, fmt.Errorf("field is not a string")
		}

		typedValue, ok := value.(string)
		if !ok {
			return false, fmt.Errorf("value is not a string")
		}

		return impl(typedField, typedValue)
	}
}
