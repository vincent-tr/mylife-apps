package business

import (
	"encoding/json"
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
	"time"
)

type ObjectValues map[string]interface{}

func NotifyAccounts(session *sessions.Session, arg struct{}) uint64 {
	accounts := getAccounts()
	viewId := notification.NotifyView(session, accounts)
	return viewId
}

func CreateAccount(code string, display string) error {
	accounts := getAccounts()

	if accounts.Exists(func(account *entities.Account) bool {
		return account.Code() == code
	}) {
		return fmt.Errorf("Account already exists: '%s'", code)
	}

	account := entities.NewAccount(&entities.AccountValues{
		Id:      accounts.NewId(),
		Code:    code,
		Display: display,
	})

	accounts.Set(account)

	return nil
}

func getAccounts() store.ICollection[*entities.Account] {
	return store.GetCollection[*entities.Account]("accounts")
}

func NotifyGroups(session *sessions.Session, arg struct{}) uint64 {
	groups := getGroups()
	viewId := notification.NotifyView(session, groups)
	return viewId
}

func fillGroupValues(group *entities.GroupValues, values ObjectValues) error {
	for key, value := range values {
		switch key {
		case "_id", "_entity":
			// ignore it
			continue

		case "parent":
			if value == nil {
				group.Parent = nil
			} else {
				parent := value.(string)
				group.Parent = &parent
			}

		case "display":
			group.Display = value.(string)

		case "rules":
			raw, _ := json.Marshal(value)
			var rules []entities.Rule
			err := json.Unmarshal(raw, &rules)
			if err != nil {
				return fmt.Errorf("Failed to unmarshal rules: %w", err)
			}

			group.Rules = rules

		default:
			return fmt.Errorf("Unknown field: %s", key)
		}
	}

	return nil
}

func (values *ObjectValues) GetId() (string, error) {
	value, ok := (*values)["_id"]
	if !ok {
		return "", fmt.Errorf("Missing ID")
	}

	id, ok := value.(string)
	if !ok {
		return "", fmt.Errorf("Invalid type for field ID: %T", value)
	}

	return id, nil
}

func CreateGroup(group ObjectValues) (*entities.Group, error) {
	groups := getGroups()

	groupValues := &entities.GroupValues{}
	if err := fillGroupValues(groupValues, group); err != nil {
		return nil, err
	}

	groupValues.Id = groups.NewId()

	groupObj := entities.NewGroup(groupValues)
	return groups.Set(groupObj)
}

func UpdateGroup(group ObjectValues) (*entities.Group, error) {
	groups := getGroups()

	id, err := group.GetId()
	if err != nil {
		return nil, err
	}

	groupObj, err := groups.Get(id)
	if err != nil {
		return nil, err
	}

	groupValues := groupObj.ToValues()
	err = fillGroupValues(groupValues, group)
	if err != nil {
		return nil, err
	}

	groupObj = entities.NewGroup(groupValues)
	return groups.Set(groupObj)
}

func DeleteGroup(id string) error {
	logger.Debugf("drop group '%s'", id)

	groups := getGroups()
	operations := getOperations()

	group, err := groups.Get(id)
	if err != nil {
		return err
	}
	hierarchyGroupsArray := []*entities.Group{group}
	hierarchyGroupsArray = append(hierarchyGroupsArray, fillChildrenGroups(groups, id)...)

	hierarchyGroupIds := make(map[string]struct{})
	for _, group := range hierarchyGroupsArray {
		hierarchyGroupIds[group.Id()] = struct{}{}
	}

	// move operations (of the whole hierarchy) to parent, or unsorted (null) if group was at root
	// move rules (of the whole hierarchy) to parent, or drop if group was at root
	// drop all children groups

	childrenOperations := operations.Filter(func(operation *entities.Operation) bool {
		group := operation.Group()

		if group == nil {
			return false
		}

		_, ok := hierarchyGroupIds[*group]
		return ok
	})

	ids := make([]string, 0, len(hierarchyGroupsArray))
	for _, group := range hierarchyGroupsArray {
		ids = append(ids, group.Id())
	}

	logger.Debugf("found groups hierarchy: %#v", ids)

	ids = make([]string, 0, len(childrenOperations))
	for _, operation := range childrenOperations {
		ids = append(ids, operation.Id())
	}

	logger.Debugf("found children operations: %#v", ids)

	for _, operation := range childrenOperations {
		values := operation.ToValues()
		values.Group = group.Parent()
		operation = entities.NewOperation(values)
		operations.Set(operation)
	}

	if group.Parent() != nil {
		parentGroup, err := groups.Get(*group.Parent())
		if err != nil {
			return err
		}

		newParentRules := append([]entities.Rule{}, parentGroup.Rules()...)

		for _, group := range hierarchyGroupsArray {
			newParentRules = append(newParentRules, group.Rules()...)
		}

		values := parentGroup.ToValues()
		values.Rules = newParentRules
		parentGroup = entities.NewGroup(values)
		groups.Set(parentGroup)
	}

	for _, group := range hierarchyGroupsArray {
		groups.Delete(group.Id())
	}

	return nil
}

func fillChildrenGroups(groups store.ICollection[*entities.Group], groupId string) []*entities.Group {
	array := make([]*entities.Group, 0)

	for _, group := range groups.Filter(func(group *entities.Group) bool {
		return group.Parent() != nil && *group.Parent() == groupId
	}) {
		array = append(array, group)
		array = append(array, fillChildrenGroups(groups, group.Id())...)
	}

	return array
}

func getGroups() store.ICollection[*entities.Group] {
	return store.GetCollection[*entities.Group]("groups")
}

func OperationsMove(groupId *string, operationIds []string) error {
	return operationsUpdate(operationIds, func(values *entities.OperationValues) {
		values.Group = groupId
	})
}

func OperationsSetNote(note string, operationIds []string) error {
	return operationsUpdate(operationIds, func(values *entities.OperationValues) {
		values.Note = note
	})
}

func OperationAppendNote(note string, operationId string) error {
	return operationsUpdate([]string{operationId}, func(values *entities.OperationValues) {
		values.Note = fmt.Sprintf("%s\n\n---\n\n%s", values.Note, note)
	})
}

func operationsUpdate(operationIds []string, updater func(values *entities.OperationValues)) error {
	operations := getOperations()

	// first find all operations (to ensure they exists and have an atomic update)
	list := make([]*entities.Operation, 0, len(operationIds))

	for _, operationId := range operationIds {
		operation, err := operations.Get(operationId)
		if err != nil {
			return err
		}

		list = append(list, operation)
	}

	for _, operation := range list {
		values := operation.ToValues()
		updater(values)
		operation = entities.NewOperation(values)
		operations.Set(operation)
	}

	return nil
}

func OperationsGetUnsorted(min time.Time, max time.Time) []*entities.Operation {
	operations := getOperations()

	list := operations.Filter(func(operation *entities.Operation) bool {
		return operation.Group() == nil && !operation.Date().Before(min) && !operation.Date().After(max)
	})

	return list
}

func getOperations() store.ICollection[*entities.Operation] {
	return store.GetCollection[*entities.Operation]("operations")
}
