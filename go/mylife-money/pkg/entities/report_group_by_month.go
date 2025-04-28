package entities

import "mylife-tools-server/services/io/serialization"

// ReportGroupByMonth
type ReportGroupByMonth struct {
	id     string
	month  string
	groups any
}

func (report *ReportGroupByMonth) Id() string {
	return report.id
}

// Month
func (report *ReportGroupByMonth) Month() string {
	return report.month
}

// Groups
func (report *ReportGroupByMonth) Groups() any {
	return report.groups
}

func (report *ReportGroupByMonth) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "report-group-by-month")
	helper.Add("_id", report.id)
	helper.Add("month", report.month)
	helper.Add("groups", report.groups)

	return helper.Build()
}

type ReportGroupByMonthValues struct {
	Id     string
	Month  string
	Groups any
}

func NewReportGroupByMonth(values *ReportGroupByMonthValues) *ReportGroupByMonth {
	return &ReportGroupByMonth{
		id:     values.Id,
		month:  values.Month,
		groups: values.Groups,
	}
}
