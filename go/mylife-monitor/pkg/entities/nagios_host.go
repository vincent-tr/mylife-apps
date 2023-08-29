package entities

import (
	"mylife-tools-server/services/io/serialization"
	"time"
)

type NagiosHostStatus string

const (
	NagiosHostPending     NagiosHostStatus = "pending"
	NagiosHostUp          NagiosHostStatus = "up"
	NagiosHostDown        NagiosHostStatus = "down"
	NagiosHostUnreachable NagiosHostStatus = "unreachable"
)

// Hôte nagios
type NagiosHost struct {
	id              string
	code            string
	display         string
	group           string
	status          NagiosHostStatus
	statusText      string
	currentAttempt  int
	maxAttempts     int
	lastCheck       time.Time
	nextCheck       time.Time
	lastStateChange time.Time
	isFlapping      bool
}

func (host *NagiosHost) Id() string {
	return host.id
}

// Code
func (host *NagiosHost) Code() string {
	return host.code
}

// Affichage
func (host *NagiosHost) Display() string {
	return host.display
}

// Groupe
func (host *NagiosHost) Group() string {
	return host.group
}

// Statut
func (host *NagiosHost) Status() NagiosHostStatus {
	return host.status
}

// Texte du statut
func (host *NagiosHost) StatusText() string {
	return host.statusText
}

// Tentative courante
func (host *NagiosHost) CurrentAttempt() int {
	return host.currentAttempt
}

// Tentatives totales
func (host *NagiosHost) MaxAttempts() int {
	return host.maxAttempts
}

// Dernier check
func (host *NagiosHost) LastCheck() time.Time {
	return host.lastCheck
}

// Prochain check
func (host *NagiosHost) NextCheck() time.Time {
	return host.nextCheck
}

// Dernier changement d'état
func (host *NagiosHost) LastStateChange() time.Time {
	return host.lastStateChange
}

// Instable
func (host *NagiosHost) IsFlapping() bool {
	return host.isFlapping
}

func (host *NagiosHost) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", host.id)
	helper.Add("code", host.code)
	helper.Add("display", host.display)
	helper.Add("group", host.group)
	helper.Add("status", host.status)
	helper.Add("statusText", host.statusText)
	helper.Add("currentAttempt", host.currentAttempt)
	helper.Add("maxAttempts", host.maxAttempts)
	helper.Add("lastCheck", host.lastCheck)
	helper.Add("nextCheck", host.nextCheck)
	helper.Add("lastStateChange", host.lastStateChange)
	helper.Add("isFlapping", host.isFlapping)

	return helper.Build()
}

type NagiosHostValues struct {
	Id              string
	Code            string
	Display         string
	Group           string
	Status          NagiosHostStatus
	StatusText      string
	CurrentAttempt  int
	MaxAttempts     int
	LastCheck       time.Time
	NextCheck       time.Time
	LastStateChange time.Time
	IsFlapping      bool
}

func NewNagiosHost(values *NagiosHostValues) *NagiosHost {
	return &NagiosHost{
		id:              values.Id,
		code:            values.Code,
		display:         values.Display,
		group:           values.Group,
		status:          values.Status,
		statusText:      values.StatusText,
		currentAttempt:  values.CurrentAttempt,
		maxAttempts:     values.MaxAttempts,
		lastCheck:       values.LastCheck,
		nextCheck:       values.NextCheck,
		lastStateChange: values.LastStateChange,
		isFlapping:      values.IsFlapping,
	}
}

func NagiosHostsEqual(a *NagiosHost, b *NagiosHost) bool {
	return a.id == b.id &&
		a.code == b.code &&
		a.display == b.display &&
		a.group == b.group &&
		a.status == b.status &&
		a.statusText == b.statusText &&
		a.currentAttempt == b.currentAttempt &&
		a.maxAttempts == b.maxAttempts &&
		a.lastCheck == b.lastCheck &&
		a.nextCheck == b.nextCheck &&
		a.lastStateChange == b.lastStateChange &&
		a.isFlapping == b.isFlapping
}
