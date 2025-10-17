package entities

import "mylife-tools-server/services/io/serialization"

// ReportOperationStat
type ReportOperationStat struct {
	id    string
	code  string
	value any
}

func (stat *ReportOperationStat) Id() string {
	return stat.id
}

// Code
func (stat *ReportOperationStat) Code() string {
	return stat.code
}

// Valeur
func (stat *ReportOperationStat) Value() any {
	return stat.value
}

func (stat *ReportOperationStat) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "report-operation-stat")
	helper.Add("_id", stat.id)
	helper.Add("code", stat.code)
	helper.Add("value", stat.value)

	return helper.Build()
}

type ReportOperationStatValues struct {
	Id    string
	Code  string
	Value any
}

func NewReportOperationStat(values *ReportOperationStatValues) *ReportOperationStat {
	return &ReportOperationStat{
		id:    values.Id,
		code:  values.Code,
		value: values.Value,
	}
}
