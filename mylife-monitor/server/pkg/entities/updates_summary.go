package entities

import (
	"mylife-tools/services/io/serialization"
)

type UpdatesSummary struct {
	id       string
	category string
	ok       int
	outdated int
	unknown  int
}

func (summary *UpdatesSummary) Id() string {
	return summary.id
}

func (summary *UpdatesSummary) Category() string {
	return summary.category
}

func (summary *UpdatesSummary) Ok() int {
	return summary.ok
}

func (summary *UpdatesSummary) Outdated() int {
	return summary.outdated
}

func (summary *UpdatesSummary) Unknown() int {
	return summary.unknown
}

func (summary *UpdatesSummary) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "updates-summary")
	helper.Add("_id", summary.id)
	helper.Add("category", summary.category)
	helper.Add("ok", summary.ok)
	helper.Add("outdated", summary.outdated)
	helper.Add("unknown", summary.unknown)

	return helper.Build()
}

type UpdatesSummaryValues struct {
	Id       string
	Category string
	Ok       int
	Outdated int
	Unknown  int
}

func NewUpdatesSummary(values *UpdatesSummaryValues) *UpdatesSummary {
	return &UpdatesSummary{
		id:       values.Id,
		category: values.Category,
		ok:       values.Ok,
		outdated: values.Outdated,
		unknown:  values.Unknown,
	}
}

func UpdatesSummariesEqual(a *UpdatesSummary, b *UpdatesSummary) bool {
	return a.id == b.id &&
		a.category == b.category &&
		a.ok == b.ok &&
		a.outdated == b.outdated &&
		a.unknown == b.unknown
}
