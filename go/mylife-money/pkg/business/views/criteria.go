package views

import (
	"fmt"
	"time"
)

type CriteriaValues map[string]interface{}

type ViewWithCriteria interface {
	SetCriteriaValues(criteriaValues CriteriaValues) error
}

type CriteriaReader struct {
	values CriteriaValues
}

func NewCriteriaReader(values CriteriaValues) *CriteriaReader {
	return &CriteriaReader{values: values}
}

func (reader *CriteriaReader) Has(key string) bool {
	_, ok := reader.values[key]
	return ok
}

func (reader *CriteriaReader) GetString(key string) (*string, error) {
	value, ok := reader.values[key]
	if !ok {
		return nil, nil
	}

	if value == nil {
		return nil, nil
	}

	if val, ok := value.(string); ok {
		return &val, nil
	}

	return nil, fmt.Errorf("Invalid type for key %s: expected string, got %T", key, value)
}

func (reader *CriteriaReader) GetDate(key string) (*time.Time, error) {
	value, ok := reader.values[key]
	if !ok {
		return nil, nil
	}

	if value == nil {
		return nil, nil
	}

	if val, ok := value.(time.Time); ok {
		return &val, nil
	}

	return nil, fmt.Errorf("Invalid type for key %s: expected time.Time, got %T", key, value)
}

func (reader *CriteriaReader) GetBool(key string, defaultValue bool) (bool, error) {
	value, ok := reader.values[key]
	if !ok {
		return defaultValue, nil
	}

	if value == nil {
		return defaultValue, nil
	}

	if val, ok := value.(bool); ok {
		return val, nil
	}

	return false, fmt.Errorf("Invalid type for key %s: expected bool, got %T", key, value)
}

func (reader *CriteriaReader) GetArray(key string) ([]any, error) {
	value, ok := reader.values[key]
	if !ok {
		return make([]any, 0), nil
	}

	if value == nil {
		return make([]any, 0), nil
	}

	if val, ok := value.([]any); ok {
		return val, nil
	}

	return nil, fmt.Errorf("Invalid type for key %s: expected []any, got %T", key, value)
}
