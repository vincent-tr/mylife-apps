package entities

import "mylife-tools-server/services/io/serialization"

// ReportGroupByPeriod
type ReportGroupByPeriod struct {
	id     string
	period string
	groups map[string]*GroupData
}

type GroupData struct {
	Amount   float64
	Children map[string]*GroupData
}

func (report *ReportGroupByPeriod) Id() string {
	return report.id
}

// Period
func (report *ReportGroupByPeriod) Period() string {
	return report.period
}

// Groups
func (report *ReportGroupByPeriod) Groups() map[string]*GroupData {
	return report.groups
}

func (report *ReportGroupByPeriod) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "report-group-by-period")
	helper.Add("_id", report.id)
	helper.Add("period", report.period)
	helper.Add("groups", report.groups)

	return helper.Build()
}

func ReportGroupByPeriodsEqual(report1 *ReportGroupByPeriod, report2 *ReportGroupByPeriod) bool {
	if report1.id != report2.id {
		return false
	}
	if report1.period != report2.period {
		return false
	}

	if !groupsEqual(report1.groups, report2.groups) {
		return false
	}

	return true
}

func groupsEqual(groups1 map[string]*GroupData, groups2 map[string]*GroupData) bool {
	if groups1 == nil && groups2 == nil {
		return true
	}
	if groups1 == nil || groups2 == nil {
		return false
	}

	if len(groups1) != len(groups2) {
		return false
	}

	for key, group1 := range groups1 {
		group2, ok := groups2[key]
		if !ok {
			return false
		}

		if group1.Amount != group2.Amount {
			return false
		}

		if !groupsEqual(group1.Children, group2.Children) {
			return false
		}
	}

	return true
}

type ReportGroupByPeriodValues struct {
	Id     string
	Period string
	Groups map[string]*GroupData
}

func NewReportGroupByPeriod(values *ReportGroupByPeriodValues) *ReportGroupByPeriod {
	return &ReportGroupByPeriod{
		id:     values.Id,
		period: values.Period,
		groups: values.Groups,
	}
}
