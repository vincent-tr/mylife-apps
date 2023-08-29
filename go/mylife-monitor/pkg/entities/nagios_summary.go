package entities

import (
	"mylife-tools-server/services/io/serialization"
)

type NagiosObjectType string

const (
	Host    NagiosObjectType = "Host"
	Service NagiosObjectType = "Service"
)

// Résumé Nagios
type NagiosSummary struct {
	id       string
	typ      NagiosObjectType
	ok       int
	warnings int
	errors   int
}

func (summary *NagiosSummary) Id() string {
	return summary.id
}

// Type d'objet
func (summary *NagiosSummary) Type() NagiosObjectType {
	return summary.typ
}

// Nombre OK
func (summary *NagiosSummary) Ok() int {
	return summary.ok
}

// Nombre de warnings
func (summary *NagiosSummary) Warnings() int {
	return summary.warnings
}

// Nombre d'erreurs
func (summary *NagiosSummary) Errors() int {
	return summary.errors
}

func (summary *NagiosSummary) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", summary.id)
	helper.Add("type", summary.typ)
	helper.Add("ok", summary.ok)
	helper.Add("warnings", summary.warnings)
	helper.Add("errors", summary.errors)

	return helper.Build()
}

type NagiosSummaryValues struct {
	Id       string
	Type     NagiosObjectType
	Ok       int
	Warnings int
	Errors   int
}

func NewNagiosSummary(values *NagiosSummaryValues) *NagiosSummary {
	return &NagiosSummary{
		id:       values.Id,
		typ:      values.Type,
		ok:       values.Ok,
		warnings: values.Warnings,
		errors:   values.Errors,
	}
}

func NagiosSummariesEqual(a *NagiosSummary, b *NagiosSummary) bool {
	return a.id == b.id &&
		a.typ == b.typ &&
		a.ok == b.ok &&
		a.warnings == b.warnings &&
		a.errors == b.errors
}
