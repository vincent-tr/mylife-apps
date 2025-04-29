package views

import (
	"fmt"
	"maps"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"slices"
	"time"
)

type groupByPeriod struct {
	groups                   store.ICollection[*entities.Group]
	groupsChangeCallback     func(event *store.Event[*entities.Group])
	operations               store.ICollection[*entities.Operation]
	operationsChangeCallback func(event *store.Event[*entities.Operation])

	container *store.Container[*entities.ReportGroupByPeriod]
	criteria  *groupByPeriodCriteria

	periodRange  func(minDate, maxDate time.Time) []string
	dateToPeriod func(date time.Time) string
}

func (view *groupByPeriod) AddListener(callback *func(event *store.Event[*entities.ReportGroupByPeriod])) {
	view.container.AddListener(callback)
}

func (view *groupByPeriod) RemoveListener(callback *func(event *store.Event[*entities.ReportGroupByPeriod])) {
	view.container.RemoveListener(callback)
}

func (view *groupByPeriod) Name() string {
	return view.container.Name()
}

func (view *groupByPeriod) Find(id string) (*entities.ReportGroupByPeriod, bool) {
	return view.container.Find(id)
}

func (view *groupByPeriod) Get(id string) (*entities.ReportGroupByPeriod, error) {
	return view.container.Get(id)
}

func (view *groupByPeriod) List() []*entities.ReportGroupByPeriod {
	return view.container.List()
}

func (view *groupByPeriod) Size() int {
	return view.container.Size()
}

func (view *groupByPeriod) Filter(predicate func(obj *entities.ReportGroupByPeriod) bool) []*entities.ReportGroupByPeriod {
	return view.container.Filter(predicate)
}

func (view *groupByPeriod) Exists(predicate func(obj *entities.ReportGroupByPeriod) bool) bool {
	return view.container.Exists(predicate)
}

func (view *groupByPeriod) Close() {
	view.groups.RemoveListener(&view.groupsChangeCallback)
	view.operations.RemoveListener(&view.operationsChangeCallback)
	view.container.Reset()
}

func (view *groupByPeriod) Refresh() {
	view.compute()
}

func makeGroupByPeriod(name string, periodRange func(minDate, maxDate time.Time) []string, dateToPeriod func(date time.Time) string) (store.IView[*entities.ReportGroupByPeriod], error) {
	groups, err := store.GetCollection[*entities.Group]("groups")
	if err != nil {
		return nil, err
	}

	operations, err := store.GetCollection[*entities.Operation]("operations")
	if err != nil {
		return nil, err
	}

	view := &groupByPeriod{
		groups:       groups,
		operations:   operations,
		container:    store.NewContainer[*entities.ReportGroupByPeriod](name),
		periodRange:  periodRange,
		dateToPeriod: dateToPeriod,
	}

	view.groupsChangeCallback = func(event *store.Event[*entities.Group]) {
		view.compute()
	}

	view.groups.AddListener(&view.groupsChangeCallback)

	view.operationsChangeCallback = func(event *store.Event[*entities.Operation]) {
		view.compute()
	}

	view.operations.AddListener(&view.operationsChangeCallback)

	return view, nil
}

type groupByPeriodCriteria struct {
	account    *string
	groups     []string
	minDate    *time.Time
	maxDate    *time.Time
	children   bool
	noChildSub bool
}

func (view *groupByPeriod) SetCriteriaValues(values CriteriaValues) error {
	criteria, err := view.buildCriteria(values)
	if err != nil {
		return err
	}

	view.criteria = criteria
	view.compute()

	return nil
}

func (view *groupByPeriod) buildCriteria(values CriteriaValues) (*groupByPeriodCriteria, error) {
	criteria := &groupByPeriodCriteria{}

	for key, value := range values {
		switch key {
		case "account":
			if account, ok := castNullable[string](value); ok {
				criteria.account = account
			} else {
				return nil, fmt.Errorf("Invalid value for account: %v", value)
			}

		case "groups":
			if groups, ok := castNullableArray(value); ok {
				stringGroups := make([]string, 0, len(groups))

				for _, group := range groups {
					if group == nil {
						// Consider nil group is "Non triés"
						stringGroups = append(stringGroups, "")
					} else if str, ok := group.(string); ok {
						stringGroups = append(stringGroups, str)
					} else {
						return nil, fmt.Errorf("Invalid value for groups: %v", group)
					}
				}

				criteria.groups = stringGroups
			} else {
				return nil, fmt.Errorf("Invalid value for groups: %v", value)
			}

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

		case "children":
			if children, ok := castNullableBool(value, false); ok {
				criteria.children = children
			} else {
				return nil, fmt.Errorf("Invalid value for children: %v", value)
			}

		case "noChildSub":
			if noChildSub, ok := castNullableBool(value, false); ok {
				criteria.noChildSub = noChildSub
			} else {
				return nil, fmt.Errorf("Invalid value for noChildSub: %v", value)
			}
		default:
			return nil, fmt.Errorf("Unknown criteria key: %s", key)
		}
	}

	return criteria, nil
}

func (view *groupByPeriod) compute() {
	if view.criteria == nil {
		view.container.Reset()
		return
	}

	if len(view.criteria.groups) == 0 {
		view.container.Reset()
		return
	}

	minDate, maxDate := view.computeDateRange()
	groupInfo := view.createGroupInfo()
	items := view.createSkeleton(groupInfo, minDate, maxDate)

	for _, operation := range view.operations.List() {
		if view.criteria.account != nil && operation.Account() != *view.criteria.account {
			continue
		}

		if operation.Date().Before(minDate) || operation.Date().After(maxDate) {
			continue
		}

		// find groups to put it
		periodItem := items[view.dateToPeriod(operation.Date())]

		group := ""
		if operation.Group() != nil {
			group = *operation.Group()
		}

		for _, info := range groupInfo {
			if _, ok := info.hierarchy[group]; !ok {
				continue
			}

			item := periodItem.Groups[info.group]
			inChildren := false

			for _, childInfo := range info.children {
				if _, ok := childInfo.hierarchy[group]; !ok {
					continue
				}

				item.Children[childInfo.group].Amount += operation.Amount()
				inChildren = true
				break
			}

			if view.criteria.noChildSub || !inChildren {
				item.Amount += operation.Amount()
			}
		}
	}

	data := slices.Collect(maps.Values(items))

	for _, periodItem := range data {
		for _, info := range groupInfo {
			item := periodItem.Groups[info.group]
			item.Amount = roundCurrency(item.Amount)

			for _, childInfo := range info.children {
				child := item.Children[childInfo.group]
				child.Amount = roundCurrency(child.Amount)
			}
		}
	}

	objects := make([]*entities.ReportGroupByPeriod, 0, len(data))

	for _, item := range data {
		objects = append(objects, entities.NewReportGroupByPeriod(item))
	}

	view.container.ReplaceAll(objects, entities.ReportGroupByPeriodsEqual)

}

func (view *groupByPeriod) computeDateRange() (time.Time, time.Time) {
	minDate, maxDate := view.criteria.minDate, view.criteria.maxDate

	if minDate == nil || maxDate == nil {
		if view.operations.Size() == 0 {
			panic("no operations")
		}

		computedMinDate := time.Date(2100, 1, 1, 0, 0, 0, 0, time.UTC)
		computedMaxDate := time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC)
		for _, operation := range view.operations.List() {
			if operation.Date().Before(computedMinDate) {
				computedMinDate = operation.Date()
			}
			if operation.Date().After(computedMaxDate) {
				computedMaxDate = operation.Date()
			}
		}

		if minDate == nil {
			minDate = &computedMinDate
		}
		if maxDate == nil {
			maxDate = &computedMaxDate
		}
	}

	return *minDate, *maxDate
}

type groupInfo struct {
	group     string
	hierarchy map[string]struct{}
	children  []groupChildInfo
}

type groupChildInfo struct {
	group     string
	hierarchy map[string]struct{}
}

func (view *groupByPeriod) createGroupInfo() []groupInfo {
	groups, children := view.criteria.groups, view.criteria.children
	ginfo := make([]groupInfo, 0)

	for _, group := range groups {
		hierarchy := createGroupHierarchy(view.groups, &group)
		childrenInfo := make([]groupChildInfo, 0)
		if children {
			childrenInfo = view.getGroupChildren(group)
		}

		ginfo = append(ginfo, groupInfo{
			group:     group,
			hierarchy: hierarchy,
			children:  childrenInfo,
		})
	}

	return ginfo
}

func (view *groupByPeriod) getGroupChildren(groupId string) []groupChildInfo {
	children := make([]groupChildInfo, 0)

	for _, group := range view.groups.List() {
		if group.Parent() != nil && *group.Parent() == groupId {
			id := group.Id()
			hierarchy := createGroupHierarchy(view.groups, &id)
			children = append(children, groupChildInfo{
				group:     group.Id(),
				hierarchy: hierarchy,
			})
		}
	}

	return children
}

func (view *groupByPeriod) createSkeleton(ginfo []groupInfo, minDate time.Time, maxDate time.Time) map[string]*entities.ReportGroupByPeriodValues {
	items := make(map[string]*entities.ReportGroupByPeriodValues)

	for _, period := range view.periodRange(minDate, maxDate) {
		periodItem := &entities.ReportGroupByPeriodValues{
			Id:     period,
			Period: period,
			Groups: make(map[string]*entities.GroupData),
		}

		items[period] = periodItem

		for _, info := range ginfo {
			item := &entities.GroupData{
				Amount:   0,
				Children: make(map[string]*entities.GroupData),
			}

			periodItem.Groups[info.group] = item

			for _, childInfo := range info.children {
				item.Children[childInfo.group] = &entities.GroupData{
					Amount: 0,
				}
			}
		}
	}

	return items
}

/*

export class GroupByPeriod extends StoreContainer {
  constructor(entityName) {
    super();
    this.groups = getStoreCollection('groups');
    this._groupChangeCallback = () => this._onGroupChange();
    this.groups.on('change', this._groupChangeCallback);

    this.operations = getStoreCollection('operations');
    this._operationChangeCallback = event => this._operationChangeCallback(event);
    this.operations.on('change', this._operationChangeCallback);

    this.entity = getMetadataEntity(entityName);
  }

  setCriteria(criteria) {
    this._criteria = criteria;
    this._compute();
  }

  refresh() {
    this._compute();
  }

  _onGroupChange() {
    this._compute();
  }

  _onOperationChange() {
    this._compute();
  }

  _compute() {
    const { account, groups } = this._criteria;

    if(!groups.length) {
      this._replaceAll([]);
      return;
    }

    const { minDate, maxDate } = computeDateRange(this._criteria, this.operations);
    const groupInfo = createGroupInfo(this._criteria, this.groups);
    const items = this._createSkeleton(groupInfo, minDate, maxDate);

    for(const operation of this.operations.list()) {
      if(account && operation.account !== account) {
        continue;
      }
      if(operation.date < minDate || operation.date > maxDate) {
        continue;
      }

      // find groups to put it
      const monthItem = items.get(this.dateToPeriod(operation.date));
      for(const { group, hierarchy, children: childrenInfo } of groupInfo) {
        if(!hierarchy.has(operation.group)) {
          continue;
        }

        const item = monthItem.groups[group];
        let inChildren = false;

        for(const { hierarchy, group: child } of childrenInfo) {
          if(!hierarchy.has(operation.group)) {
            continue;
          }

          item.children[child].amount += operation.amount;
          inChildren = true;
          break;
        }

        if(this._criteria.noChildSub || !inChildren) {
          item.amount += operation.amount;
        }
      }
    }

    const data = Array.from(items.values());
    for(const monthItem of data) {
      for(const { group, children: childrenInfo } of groupInfo) {
        const item = monthItem.groups[group];
        item.amount = roundCurrency(item.amount);
        for(const { group: childGroup } of childrenInfo) {
          const child = item.children[childGroup];
          child.amount = roundCurrency(child.amount);
        }
      }
    }

    const objects = data.map(item => this.entity.newObject(item));
    this._replaceAll(objects);
  }

  _createSkeleton(groupInfo, minDate, maxDate) {
    const items = new Map();
    for(const period of this.periodRange(minDate, maxDate)) {
      const periodItem = this.itemFactory(period);

      items.set(period, periodItem);

      periodItem.groups = {};
      for(const { group, children } of groupInfo) {
        const item = periodItem.groups[group || 'null'] = {
          amount: 0,
          children: {}
        };
        for(const { group } of children) {
          item.children[group] = { amount: 0 };
        }
      }
    }

    return items;
  }

  periodRange(minDate, maxDate): string[] {
    void minDate, maxDate;
    throw new Error('Not implemented');
  }

  itemFactory(period: string): any {
    void period;
    throw new Error('Not implemented');
  }

  dateToPeriod(date): string {
    void date;
    throw new Error('Not implemented');
  }

  close() {
    this.operations.off('change', this._operationChangeCallback);
    this.groups.off('change', this._groupChangeCallback);
    this._reset();
  }
}

function computeDateRange(criteria, operationCollection) {
  let { minDate, maxDate } = criteria;
  if((!minDate || !maxDate) && operationCollection.size) {
    let computedMinDate = Infinity;
    let computedMaxDate = -Infinity;
    for(const operation of operationCollection.list()) {
      computedMinDate = Math.min(computedMinDate, operation.date);
      computedMaxDate = Math.max(computedMaxDate, operation.date);
    }
    minDate = minDate || new Date(computedMinDate);
    maxDate = maxDate || new Date(computedMaxDate);
  }
  return { minDate, maxDate };
}

function createGroupInfo(criteria, groupCollection) {
  const { groups, children } = criteria;

  return groups.map(group => ({
    group: group || 'null',
    hierarchy: createGroupHierarchy(groupCollection, group),
    children: children ? getGroupChildren(groupCollection, group) : []
  }));
}

function getGroupChildren(groupCollection, groupId) {
  const results = [];
  for(const group of groupCollection.list()) {
    if(group.parent === groupId) {
      results.push({
        group: group._id,
        hierarchy: createGroupHierarchy(groupCollection, group._id)
      });
    }
  }
  return results;
}
*/
