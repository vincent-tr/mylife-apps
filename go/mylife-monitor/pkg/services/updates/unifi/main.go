package unifi

import (
	"context"
	"fmt"
	"mylife-monitor/pkg/entities"
	"slices"
	"sort"
	"time"

	"mylife-tools-server/log"
)

var logger = log.CreateLogger("mylife:monitor:updates:unifi")

func Fetch(controller string, user string, pass string) ([]*entities.UpdatesVersionValues, error) {
	devices, err := fetchController(controller, user, pass)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()

	versions := make([]*entities.UpdatesVersionValues, 0)
	lookup := makeVersionLookup()

	for _, device := range devices {
		version := &entities.UpdatesVersionValues{
			Path:           []string{"unifi", device.Site, fmt.Sprintf("%s (%s)", device.Name, device.Model)},
			Status:         entities.UpdatesVersionUnknown,
			CurrentVersion: device.Version,
		}

		versions = append(versions, version)

		data, err := lookup.Get(ctx, device.Model, device.Version)
		if err != nil {
			logger.WithError(err).WithField("model", device.Model).Error("Error getting device version data")
			continue
		}

		version.CurrentVersion = data.Current.String()
		version.CurrentCreated = data.Current.Created
		version.LatestVersion = data.Latest.String()
		version.LatestCreated = data.Latest.Created

		if version.CurrentVersion == version.LatestVersion {
			version.Status = entities.UpdatesVersionUptodate
		} else {
			version.Status = entities.UpdatesVersionOutdated
		}
	}

	return versions, nil
}

type versionData struct {
	Current *version
	Latest  *version
}

type versionLookup struct {
	versions map[string][]version // sort by created desc
}

func makeVersionLookup() *versionLookup {
	return &versionLookup{versions: make(map[string][]version)}
}

func (lookup *versionLookup) Get(ctx context.Context, model string, deviceVersion string) (*versionData, error) {
	versions, found := lookup.versions[model]
	if !found {
		var err error
		versions, err = fetchOnline(ctx,
			filter{Operator: "eq", Field: "channel", Value: "release"},
			filter{Operator: "eq", Field: "product", Value: "unifi-firmware"},
			filter{Operator: "eq", Field: "platform", Value: model},
		)

		if err != nil {
			return nil, err
		}

		sort.Slice(versions, func(i, j int) bool {
			return versions[i].Created.After(versions[j].Created)
		})

		lookup.versions[model] = versions
	}

	if len(versions) == 0 {
		return nil, fmt.Errorf("model not found: %s", model)
	}

	currentIndex := slices.IndexFunc(versions, func(candidate version) bool {
		return candidate.String() == deviceVersion
	})

	if currentIndex == -1 {
		return nil, fmt.Errorf("version not found: %s", deviceVersion)
	}

	data := &versionData{
		Current: &versions[currentIndex],
		Latest:  &versions[0],
	}

	return data, nil
}
