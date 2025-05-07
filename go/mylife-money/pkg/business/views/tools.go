package views

import (
	"fmt"
	"math"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
	"time"
)

func DateToMonth(date time.Time) string {
	return fmt.Sprintf("%04d/%02d", date.Year(), int(date.Month()))
}

func dateToYear(date time.Time) string {
	return fmt.Sprintf("%04d", date.Year())
}

func roundCurrency(number float64) float64 {
	if !isFinite(number) {
		return number
	}

	return float64(int(number*100)) / 100
}

func isFinite(number float64) bool {
	return !math.IsNaN(number) && !math.IsInf(number, 0)
}

func monthRange(minDate time.Time, maxDate time.Time) []string {
	months := make([]string, 0)
	minYear := minDate.Year()
	minMonth := int(minDate.Month())
	maxYear := maxDate.Year()
	maxMonth := int(maxDate.Month())

	for year := minYear; year <= maxYear; year++ {
		for month := 1; month <= 12; month++ {
			if year == minYear && month < minMonth {
				continue
			}
			if year == maxYear && month > maxMonth {
				continue
			}

			months = append(months, fmt.Sprintf("%04d/%02d", year, month))
		}
	}

	return months
}

func yearRange(minDate time.Time, maxDate time.Time) []string {
	years := make([]string, 0)
	minYear := minDate.Year()
	maxYear := maxDate.Year()

	for year := minYear; year <= maxYear; year++ {
		years = append(years, fmt.Sprintf("%04d", year))
	}

	return years
}

func createGroupHierarchy(groupCollection store.IContainer[*entities.Group], groupId *string) map[string]struct{} {
	// no criteria
	if groupId == nil {
		return nil
	}

	hierarchy := make(map[string]struct{})

	// unsorted group
	if *groupId == "" {
		hierarchy[""] = struct{}{}
		return hierarchy
	}

	groupIdsToProcess := make(map[string]struct{})
	groupIdsToProcess[*groupId] = struct{}{}

	for len(groupIdsToProcess) > 0 {
		// get first item
		var id string
		for key, _ := range groupIdsToProcess {
			id = key
			break
		}

		delete(groupIdsToProcess, id)
		hierarchy[id] = struct{}{}

		for _, group := range groupCollection.List() {
			if group.ParentEq(&id) {
				groupIdsToProcess[group.Id()] = struct{}{}
			}
		}
	}

	return hierarchy
}
