package views

import (
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"strings"
	"time"
)

type OperationView struct {
	view                  store.IView[*entities.Operation]
	groups                store.IContainer[*entities.Group]
	criteria              *operationViewCriteria
	onGroupChangeCallback func(event *store.Event[*entities.Group])
}

var _ store.IView[*entities.Operation] = (*OperationView)(nil)

func (view *OperationView) AddListener(callback *func(event *store.Event[*entities.Operation])) {
	view.view.AddListener(callback)
}

func (view *OperationView) RemoveListener(callback *func(event *store.Event[*entities.Operation])) {
	view.view.RemoveListener(callback)
}

func (view *OperationView) Name() string {
	return view.view.Name()
}

func (view *OperationView) Find(id string) (*entities.Operation, bool) {
	return view.view.Find(id)
}

func (view *OperationView) Get(id string) (*entities.Operation, error) {
	return view.view.Get(id)
}

func (view *OperationView) List() []*entities.Operation {
	return view.view.List()
}

func (view *OperationView) Size() int {
	return view.view.Size()
}

func (view *OperationView) Filter(predicate func(obj *entities.Operation) bool) []*entities.Operation {
	return view.view.Filter(predicate)
}

func (view *OperationView) Exists(predicate func(obj *entities.Operation) bool) bool {
	return view.view.Exists(predicate)
}

func (view *OperationView) Refresh() {
	view.view.Refresh()
}

func (view *OperationView) Close() {
	view.view.Close()
	view.groups.RemoveListener(&view.onGroupChangeCallback)
}

func MakeOperationView() (*OperationView, error) {
	operations, err := store.GetCollection[*entities.Operation]("operations")
	if err != nil {
		return nil, err
	}

	groups, err := store.GetCollection[*entities.Group]("groups")
	if err != nil {
		return nil, err
	}

	view := &OperationView{
		groups: groups,
	}

	view.view = store.NewView(operations, view.filterCallack)
	view.onGroupChangeCallback = view.onGroupChange

	view.groups.AddListener(&view.onGroupChangeCallback)

	return view, nil
}

func (v *OperationView) filterCallack(operation *entities.Operation) bool {
	if v.criteria == nil {
		return true
	}

	minDate := v.criteria.minDate
	if minDate != nil && operation.Date().Before(*minDate) {
		return false
	}

	maxDate := v.criteria.maxDate
	if maxDate != nil && operation.Date().After(*maxDate) {
		return false
	}

	account := v.criteria.account
	if account != nil && operation.Account() != *account {
		return false
	}

	groups := v.criteria.groupHierarchy
	if groups != nil {
		// default to empty string for this lookup
		var group string
		if operation.Group() != nil {
			group = *operation.Group()
		}

		if _, ok := groups[group]; !ok {
			return false
		}
	}

	lookupText := v.criteria.lookupText
	if lookupText != nil && !matchText(operation.Label(), *lookupText) && !matchText(operation.Note(), *lookupText) {
		return false
	}

	return true
}

func (view *OperationView) onGroupChange(event *store.Event[*entities.Group]) {
	if view.criteria == nil {
		return
	}

	view.criteria.groupHierarchy = createGroupHierarchy(view.groups, view.criteria.group)
	view.view.Refresh()
}

func (view *OperationView) SetCriteriaValues(criteriaValues CriteriaValues) error {
	criteria, err := buildCriteria(criteriaValues, view.groups)
	if err != nil {
		return err
	}

	view.criteria = criteria
	view.view.Refresh()

	return nil
}

type operationViewCriteria struct {
	minDate        *time.Time
	maxDate        *time.Time
	account        *string
	group          *string
	groupHierarchy map[string]struct{}
	lookupText     *string
}

func buildCriteria(values CriteriaValues, groupCollection store.IContainer[*entities.Group]) (*operationViewCriteria, error) {
	criteria := &operationViewCriteria{}

	for key, value := range values {
		switch key {
		case "minDate":
			if date, ok := castNullable[time.Time](value); ok {
				criteria.minDate = date
			} else {
				return nil, fmt.Errorf("Invalid value for minDate: %v", value)
			}

		case "maxDate":
			if date, ok := castNullable[time.Time](value); ok {
				criteria.maxDate = date
			} else {
				return nil, fmt.Errorf("Invalid value for maxDate: %v", value)
			}

		case "account":
			if account, ok := castNullable[string](value); ok {
				criteria.account = account
			} else {
				return nil, fmt.Errorf("Invalid value for account: %v", value)
			}

		case "group":
			if group, ok := castNullable[string](value); ok {
				criteria.group = group
				criteria.groupHierarchy = createGroupHierarchy(groupCollection, criteria.group)
			} else {
				return nil, fmt.Errorf("Invalid value for group: %v", value)
			}

		case "lookupText":
			if text, ok := castNullable[string](value); ok {
				if text != nil {
					*text = strings.ToLower(*text)
				}
				criteria.lookupText = text
			} else {
				return nil, fmt.Errorf("Invalid value for lookupText: %v", value)
			}

		default:
			return nil, fmt.Errorf("Unknown field: %s", key)
		}
	}

	return criteria, nil
}

func matchText(value, text string) bool {
	return strings.Contains(strings.ToLower(value), text)
}

func castNullable[T any](value any) (*T, bool) {
	if value == nil {
		return nil, true
	}

	if val, ok := value.(T); ok {
		return &val, true
	}

	return nil, false
}
