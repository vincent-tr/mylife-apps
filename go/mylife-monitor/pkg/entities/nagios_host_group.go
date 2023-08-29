package entities

import "mylife-tools-server/services/io/serialization"

// Groupe d'hôtes nagios
type NagiosHostGroup struct {
	id      string
	code    string
	display string
}

func (summary *NagiosHostGroup) Id() string {
	return summary.id
}

// Code
func (summary *NagiosHostGroup) Code() string {
	return summary.code
}

// Affichage
func (summary *NagiosHostGroup) Display() string {
	return summary.display
}

func (summary *NagiosHostGroup) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", summary.id)
	helper.Add("code", summary.code)
	helper.Add("display", summary.display)

	return helper.Build()
}

type NagiosHostGroupValues struct {
	Id      string
	Code    string
	Display string
}

func NewNagiosHostGroup(values *NagiosHostGroupValues) *NagiosHostGroup {
	return &NagiosHostGroup{
		id:      values.Id,
		code:    values.Code,
		display: values.Display,
	}
}

func NagiosHostGroupsEqual(a *NagiosHostGroup, b *NagiosHostGroup) bool {
	return a.id == b.id &&
		a.code == b.code &&
		a.display == b.display
}
