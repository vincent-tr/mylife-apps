package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools/services/store"
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

func MakeOperationView() *OperationView {
	operations := store.GetCollection[*entities.Operation]("operations")
	groups := store.GetCollection[*entities.Group]("groups")

	view := &OperationView{
		groups: groups,
	}

	view.view = store.NewView(operations, view.filterCallack)
	view.onGroupChangeCallback = view.onGroupChange

	view.groups.AddListener(&view.onGroupChangeCallback)

	return view
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
	criteria, err := view.buildCriteria(criteriaValues)
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

func (view *OperationView) buildCriteria(values CriteriaValues) (*operationViewCriteria, error) {
	criteria := &operationViewCriteria{}
	reader := NewCriteriaReader(values)

	if reader.Has("minDate") {
		minDate, err := reader.GetDate("minDate")
		if err != nil {
			return nil, err
		}
		criteria.minDate = minDate
	}

	if reader.Has("maxDate") {
		maxDate, err := reader.GetDate("maxDate")
		if err != nil {
			return nil, err
		}
		criteria.maxDate = maxDate
	}

	if reader.Has("account") {
		account, err := reader.GetString("account")
		if err != nil {
			return nil, err
		}
		criteria.account = account
	}

	if reader.Has("group") {
		group, err := reader.GetString("group")
		if err != nil {
			return nil, err
		}

		// Special case:
		// if group does not exists, no criteria (group=nil) => default value
		// if group exists but is nil, "Non triés" (group="")
		// if group exists and is not nil, group id
		if group == nil {
			unsortedGroup := ""
			criteria.group = &unsortedGroup
		} else {
			criteria.group = group
		}
	}

	if reader.Has("lookupText") {
		text, err := reader.GetString("lookupText")
		if err != nil {
			return nil, err
		}

		if text != nil {
			*text = strings.ToLower(*text)
		}
		criteria.lookupText = text
	}

	criteria.groupHierarchy = createGroupHierarchy(view.groups, criteria.group)

	return criteria, nil
}

func matchText(value, text string) bool {
	return strings.Contains(strings.ToLower(value), text)
}
