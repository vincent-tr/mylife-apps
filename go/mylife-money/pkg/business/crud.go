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

func NotifyAccounts(session *sessions.Session, arg struct{}) (uint64, error) {
	accounts, err := getAccounts()
	if err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, accounts)
	return viewId, nil
}

func CreateAccount(code string, display string) error {
	accounts, err := getAccounts()
	if err != nil {
		return err
	}

	if accounts.Exists(func(account *entities.Account) bool {
		return account.Code() == code
	}) {
		return fmt.Errorf("Account already exists: '%s'", code)
	}

	account := entities.NewAccount(&entities.AccountValues{
		Code:    code,
		Display: display,
	})

	accounts.Set(account)

	return nil
}

func getAccounts() (store.ICollection[*entities.Account], error) {
	return store.GetCollection[*entities.Account]("accounts")
}

func NotifyGroups(session *sessions.Session, arg struct{}) (uint64, error) {
	groups, err := getGroups()
	if err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, groups)
	return viewId, nil
}

func fillGroupValues(group *entities.GroupValues, values ObjectValues) error {
	for key, value := range values {
		switch key {
		case "_id":
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
	groups, err := getGroups()
	if err != nil {
		return nil, err
	}

	groupValues := &entities.GroupValues{}
	err = fillGroupValues(groupValues, group)
	if err != nil {
		return nil, err
	}

	groupObj := entities.NewGroup(groupValues)
	return groups.Set(groupObj)
}

func UpdateGroup(group ObjectValues) (*entities.Group, error) {
	groups, err := getGroups()
	if err != nil {
		return nil, err
	}

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

/*
func DeleteGroup(id: string) {
  logger.debug(`drop group '${id}'`);

  const groups = getStoreCollection('groups');
  const operations = getStoreCollection('operations');

  const group = groups.get(id);

  const hierarchyGroupsArray = [group];
  fillChildrenGroups(hierarchyGroupsArray, id);
  const hierarchyGroupIds = new Set(hierarchyGroupsArray.map(group => group._id));

  // move operations (of the whole hierarchy) to parent, or unsorted (null) if group was at root
  // move rules (of the whole hierarchy) to parent, or drop if group was at root
  // drop all children groups

  const childrenOperations = operations.filter(operation => hierarchyGroupIds.has(operation.group));

  logger.debug(`found groups hierarchy: ${JSON.stringify(hierarchyGroupsArray.map(grp => grp._id))}`);
  logger.debug(`found children operations: ${JSON.stringify(childrenOperations.map(op => op._id))}`);

  for (const operation of childrenOperations) {
    operations.set(operations.entity.setValues(operation, { group: group.parent }));
  }

  if (group.parent) {
    const parentGroup = groups.get(group.parent);

    let newParentRules = [...parentGroup.rules];

    for (const group of hierarchyGroupsArray) {
      newParentRules = newParentRules.concat(group.rules);
    }

    groups.set(groups.entity.setValues(parentGroup, { rules: newParentRules }));
  }

  for (const group of hierarchyGroupsArray) {
    groups.delete(group._id);
  }
}

function fillChildrenGroups(array, groupId: string) {
  const groups = getStoreCollection('groups');

  for (const group of groups.filter(group => group.parent === groupId)) {
    array.push(group);
    fillChildrenGroups(array, group._id);
  }
}
*/

func getGroups() (store.ICollection[*entities.Group], error) {
	return store.GetCollection[*entities.Group]("groups")
}

func OperationsMove(groupId *string, operationIds []string) (int, error) {
	return operationsUpdate(operationIds, func(values *entities.OperationValues) {
		values.Group = groupId
	})
}

func OperationsSetNote(note string, operationIds []string) (int, error) {
	return operationsUpdate(operationIds, func(values *entities.OperationValues) {
		values.Note = note
	})
}

/*
	func OperationAppendNote(note string, operationId string) {
	  const operations = getStoreCollection('operations');
	  const field = operations.entity.getField('note');

	  let operation = operations.get(operationId);

	  const oldNote = field.getValue(operation);
	  const newNote = oldNote ? `${oldNote}\n\n---\n\n${note}` : note;
	  operation = field.setValue(operation, newNote);

	  operations.set(operation);
	}
*/
func operationsUpdate(operationIds []string, updater func(values *entities.OperationValues)) (int, error) {
	operations, err := getOperations()
	if err != nil {
		return 0, err
	}

	ids := make(map[string]struct{})
	for _, id := range operationIds {
		ids[id] = struct{}{}
	}

	list := operations.Filter(func(operation *entities.Operation) bool {
		_, ok := ids[operation.Id()]
		return ok
	})

	for _, operation := range list {
		values := operation.ToValues()
		updater(values)
		operation = entities.NewOperation(values)
		operations.Set(operation)
	}

	return len(list), nil
}

func OperationsGetUnsorted(min time.Time, max time.Time) ([]*entities.Operation, error) {
	operations, err := getOperations()
	if err != nil {
		return nil, err
	}

	list := operations.Filter(func(operation *entities.Operation) bool {
		return operation.Group() == nil && !operation.Date().Before(min) && !operation.Date().After(max)
	})

	return list, nil
}

func getOperations() (store.ICollection[*entities.Operation], error) {
	return store.GetCollection[*entities.Operation]("operations")
}
