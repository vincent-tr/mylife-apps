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

func makeGroupByPeriod(name string, periodRange func(minDate, maxDate time.Time) []string, dateToPeriod func(date time.Time) string) store.IView[*entities.ReportGroupByPeriod] {
	groups := store.GetCollection[*entities.Group]("groups")
	operations := store.GetCollection[*entities.Operation]("operations")

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

	return view
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
	reader := NewCriteriaReader(values)

	if reader.Has("account") {
		account, err := reader.GetString("account")
		if err != nil {
			return nil, err
		}
		criteria.account = account
	}

	if reader.Has("groups") {
		groups, err := reader.GetArray("groups")
		if err != nil {
			return nil, err
		}
		stringGroups := make([]string, 0, len(groups))

		for _, group := range groups {
			if group == nil {
				// Consider nil group is unsorted group
				stringGroups = append(stringGroups, "")
			} else if str, ok := group.(string); ok {
				stringGroups = append(stringGroups, str)
			} else {
				return nil, fmt.Errorf("Invalid value for groups: %v", group)
			}
		}

		criteria.groups = stringGroups
	}

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

	children, err := reader.GetBool("children", false)
	if err != nil {
		return nil, err
	}
	criteria.children = children

	noChildSub, err := reader.GetBool("noChildSub", false)
	if err != nil {
		return nil, err
	}
	criteria.noChildSub = noChildSub

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
			item.Amount = RoundCurrency(item.Amount)

			for _, childInfo := range info.children {
				child := item.Children[childInfo.group]
				child.Amount = RoundCurrency(child.Amount)

				if childInfo.group == "" {
					// UI expect "null" for unsorted group
					delete(item.Children, "")
					item.Children["null"] = child
				}
			}
		}
	}

	// UI expect "null" for unsorted group
	// Note: do that after, else if unsorted group is selected twice it will crash
	for _, periodItem := range data {
		item, ok := periodItem.Groups[""]
		if ok {
			delete(periodItem.Groups, "")
			periodItem.Groups["null"] = item
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
