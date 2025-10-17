package entities

import (
	"mylife-tools-server/services/io/serialization"
	"time"
)

type UpsmonSummary struct {
	id      string
	date    time.Time
	upsName string
	status  string
}

func (summary *UpsmonSummary) Id() string {
	return summary.id
}

// The date and time that the information was last obtained from the UPS.
func (summary *UpsmonSummary) Date() time.Time {
	return summary.date
}

// The name of the UPS as stored in the EEPROM or in the UPSNAME directive in the configuration file.
func (summary *UpsmonSummary) UPSName() string {
	return summary.upsName
}

// The current summary of the UPS (ONLINE, ONBATT, etc.)
func (summary *UpsmonSummary) Status() string {
	return summary.status
}

func (summary *UpsmonSummary) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "upsmon-summary")
	helper.Add("_id", summary.id)
	helper.Add("date", summary.date)
	helper.Add("upsName", summary.upsName)
	helper.Add("status", summary.status)

	return helper.Build()
}

type UpsmonSummaryValues struct {
	Id      string
	Date    time.Time
	UPSName string
	Status  string
}

func NewUpsmonSummary(values *UpsmonSummaryValues) *UpsmonSummary {
	return &UpsmonSummary{
		id:      values.Id,
		date:    values.Date,
		upsName: values.UPSName,
		status:  values.Status,
	}
}

func UpsmonSummariesEqual(a *UpsmonSummary, b *UpsmonSummary) bool {
	return a.id == b.id &&
		a.date == b.date &&
		a.upsName == b.upsName &&
		a.status == b.status
}
