package entities

import (
	"mylife-tools/services/io/serialization"
	"slices"
	"time"
)

type UpdatesVersionStatus string

const (
	UpdatesVersionUptodate UpdatesVersionStatus = "uptodate"
	UpdatesVersionOutdated UpdatesVersionStatus = "outdated"
	UpdatesVersionUnknown  UpdatesVersionStatus = "unknown"
)

type UpdatesVersion struct {
	id             string
	path           []string
	status         UpdatesVersionStatus
	currentVersion string
	currentCreated time.Time
	latestVersion  string
	latestCreated  time.Time
}

func (version *UpdatesVersion) Id() string {
	return version.id
}

func (version *UpdatesVersion) Path() []string {
	return version.path
}

func (version *UpdatesVersion) Status() UpdatesVersionStatus {
	return version.status
}

func (version *UpdatesVersion) CurrentVersion() string {
	return version.currentVersion
}

func (version *UpdatesVersion) CurrentCreated() time.Time {
	return version.currentCreated
}

func (version *UpdatesVersion) LatestVersion() string {
	return version.latestVersion
}

func (version *UpdatesVersion) LatestCreated() time.Time {
	return version.latestCreated
}

func (version *UpdatesVersion) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "updates-version")
	helper.Add("_id", version.id)
	helper.Add("path", version.path)
	helper.Add("status", version.status)
	helper.Add("currentVersion", version.currentVersion)
	helper.Add("currentCreated", version.currentCreated)
	helper.Add("latestVersion", version.latestVersion)
	helper.Add("latestCreated", version.latestCreated)

	return helper.Build()
}

type UpdatesVersionValues struct {
	Id             string
	Path           []string
	Status         UpdatesVersionStatus
	CurrentVersion string
	CurrentCreated time.Time
	LatestVersion  string
	LatestCreated  time.Time
}

func NewUpdatesVersion(values *UpdatesVersionValues) *UpdatesVersion {
	return &UpdatesVersion{
		id:             values.Id,
		path:           values.Path,
		status:         values.Status,
		currentVersion: values.CurrentVersion,
		currentCreated: values.CurrentCreated,
		latestVersion:  values.LatestVersion,
		latestCreated:  values.LatestCreated,
	}
}

func UpdatesVersionsEqual(a *UpdatesVersion, b *UpdatesVersion) bool {
	return a.id == b.id &&
		slices.Equal(a.path, b.path) &&
		a.status == b.status &&
		a.currentVersion == b.currentVersion &&
		a.currentCreated == b.currentCreated &&
		a.latestVersion == b.latestVersion &&
		a.latestCreated == b.latestCreated
}
