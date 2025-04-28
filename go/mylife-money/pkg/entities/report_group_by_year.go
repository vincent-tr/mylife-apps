package entities

import "mylife-tools-server/services/io/serialization"

// ReportGroupByYear
type ReportGroupByYear struct {
	id     string
	year   string
	groups any
}

func (report *ReportGroupByYear) Id() string {
	return report.id
}

// Year
func (report *ReportGroupByYear) Year() string {
	return report.year
}

// Groups
func (report *ReportGroupByYear) Groups() any {
	return report.groups
}

func (report *ReportGroupByYear) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "report-group-by-year")
	helper.Add("_id", report.id)
	helper.Add("year", report.year)
	helper.Add("groups", report.groups)

	return helper.Build()
}

type ReportGroupByYearValues struct {
	Id     string
	Year   string
	Groups any
}

func NewReportGroupByYear(values *ReportGroupByYearValues) *ReportGroupByYear {
	return &ReportGroupByYear{
		id:     values.Id,
		year:   values.Year,
		groups: values.Groups,
	}
}
