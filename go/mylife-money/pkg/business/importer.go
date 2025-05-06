package business

import (
	"encoding/csv"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"strconv"
	"strings"
	"time"
)

/*
import { parse as csv } from 'csv-parse/sync';
import moment from 'moment';
import { createLogger, getStoreCollection } from 'mylife-tools-server';

const logger = createLogger('mylife:money:importer');
*/

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

	records, err = filterExisting(records)
	if err != nil {
		return 0, err
	}

	err = insertRecords(records)
	if err != nil {
		return 0, err
	}

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
			return nil, fmt.Errorf("error parsing record: %w", err)
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
		return record{}, fmt.Errorf("invalid record: no debit or credit")
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

func findLastOperation() (*entities.Operation, error) {
	operations, err := store.GetCollection[*entities.Operation]("operations")
	if operations == nil {
		return nil, err
	}

	var lastOperation *entities.Operation

	for _, operation := range operations.List() {
		if lastOperation == nil || operation.Date().After(lastOperation.Date()) {
			lastOperation = operation
		}
	}

	return lastOperation, nil
}

func filterExisting(records []record) ([]record, error) {
	operations, err := store.GetCollection[*entities.Operation]("operations")
	if operations == nil {
		return nil, err
	}

	lastOperation, err := findLastOperation()
	if err != nil {
		return nil, err
	}

	if lastOperation == nil {
		return records, nil
	}

	lastOperationDate := lastOperation.Date()
	lastDayOperations := operations.Filter(func(op *entities.Operation) bool {
		return op.Date().Equal(lastOperationDate)
	})

	opHashSet := make(map[string]bool)
	for _, op := range lastDayOperations {
		opHashSet[fmt.Sprintf("%f|%s|%s", op.Amount(), op.Account(), op.Label())] = true
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

		recHash := fmt.Sprintf("%f|%s|%s", rec.amount, rec.account, rec.label)
		if !opHashSet[recHash] {
			filteredRecords = append(filteredRecords, rec)
		}
	}

	return filteredRecords, nil
}

func insertRecords(records []record) error {
	operations, err := store.GetCollection[*entities.Operation]("operations")
	if operations == nil {
		return err
	}

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

	return nil
}

func ExecuteRules() (int, error) {
	logger.Info("Executing rules")
	/*
	   const operations = getStoreCollection('operations');
	   const groups = getStoreCollection('groups');

	   const unsortedOperations = operations.filter(operation => !operation.group);
	   const ruleExecutor = buildRulesExecutor(groups.list());

	   const groupField = operations.entity.getField('group');
	   let opCount = 0;
	   for(const operation of unsortedOperations) {
	     const group = ruleExecutor(operation);
	     if(!group) { continue; }

	     logger.info(`Moving operation ${operation._id} to group ${group._id} (${group.display})`);
	     operations.set(groupField.setValue(operation, group._id));
	     ++opCount;
	   }
	*/
	opCount := 0
	return 0, fmt.Errorf("TODO: ExecuteRules not implemented")

	logger.Infof("Execution done, moved %d operations", opCount)

	return opCount, nil
}

/*
function buildRulesExecutor(groups) {
  const operators = {
    $eq       : (field, value) => field === value,
    $gt       : (field, value) => field < value,
    $gte      : (field, value) => field <= value,
    $lt       : (field, value) => field > value,
    $lte      : (field, value) => field >= value,
    $regex    : (field, value) => (new RegExp(value).test(field)),
    $contains : (field, value) => (field && field.toString().includes(value))
  };

  const conditionExecutorFactory = (condition) => (operation) => operators[condition.operator](operation[condition.field], condition.value);

  const ruleExecutorFactory = (rule) => {
    const conditionExecutors = rule.conditions.map(conditionExecutorFactory);
    if(!conditionExecutors) { return () => false; }
    return (operation) => {
      for(const executor of conditionExecutors) {
        if(!executor(operation)) { return false; }
      }
      return true;
    };
  };

  const rules = [];
  for(const group of groups) {
    if(!group.rules) { continue; }
    for(const rule of group.rules) {
      rules.push({
        executor: ruleExecutorFactory(rule),
        group
      });
    }
  }

  return (operation) => {
    for(const rule of rules) {
      if(rule.executor(operation)) {
        return rule.group;
      }
    }
  };
}
*/
