package entities

import (
	"mylife-tools-server/services/io/serialization"
	"time"
)

type NagiosServiceStatus string

const (
	NagiosServicePending  NagiosServiceStatus = "pending"
	NagiosServiceOk       NagiosServiceStatus = "ok"
	NagiosServiceWarning  NagiosServiceStatus = "warning"
	NagiosServiceUnknown  NagiosServiceStatus = "unknown"
	NagiosServiceCritical NagiosServiceStatus = "critical"
)

// Service nagios
type NagiosService struct {
	id              string
	code            string
	display         string
	host            string
	status          NagiosServiceStatus
	statusText      string
	currentAttempt  int
	maxAttempts     int
	lastCheck       time.Time
	nextCheck       time.Time
	lastStateChange time.Time
	isFlapping      bool
}

func (host *NagiosService) Id() string {
	return host.id
}

// Code
func (host *NagiosService) Code() string {
	return host.code
}

// Affichage
func (host *NagiosService) Display() string {
	return host.display
}

// Hôte
func (host *NagiosService) Host() string {
	return host.host
}

// Statut
func (host *NagiosService) Status() NagiosServiceStatus {
	return host.status
}

// Texte du statut
func (host *NagiosService) StatusText() string {
	return host.statusText
}

// Tentative courante
func (host *NagiosService) CurrentAttempt() int {
	return host.currentAttempt
}

// Tentatives totales
func (host *NagiosService) MaxAttempts() int {
	return host.maxAttempts
}

// Dernier check
func (host *NagiosService) LastCheck() time.Time {
	return host.lastCheck
}

// Prochain check
func (host *NagiosService) NextCheck() time.Time {
	return host.nextCheck
}

// Dernier changement d'état
func (host *NagiosService) LastStateChange() time.Time {
	return host.lastStateChange
}

// Instable
func (host *NagiosService) IsFlapping() bool {
	return host.isFlapping
}

func (host *NagiosService) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "nagios-service")
	helper.Add("_id", host.id)
	helper.Add("code", host.code)
	helper.Add("display", host.display)
	helper.Add("host", host.host)
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

type NagiosServiceValues struct {
	Id              string
	Code            string
	Display         string
	Host            string
	Status          NagiosServiceStatus
	StatusText      string
	CurrentAttempt  int
	MaxAttempts     int
	LastCheck       time.Time
	NextCheck       time.Time
	LastStateChange time.Time
	IsFlapping      bool
}

func NewNagiosService(values *NagiosServiceValues) *NagiosService {
	return &NagiosService{
		id:              values.Id,
		code:            values.Code,
		display:         values.Display,
		host:            values.Host,
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

func NagiosServicesEqual(a *NagiosService, b *NagiosService) bool {
	return a.id == b.id &&
		a.code == b.code &&
		a.display == b.display &&
		a.host == b.host &&
		a.status == b.status &&
		a.statusText == b.statusText &&
		a.currentAttempt == b.currentAttempt &&
		a.maxAttempts == b.maxAttempts &&
		a.lastCheck == b.lastCheck &&
		a.nextCheck == b.nextCheck &&
		a.lastStateChange == b.lastStateChange &&
		a.isFlapping == b.isFlapping
}
