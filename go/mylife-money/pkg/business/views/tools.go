package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
)

/*
	export function dateToMonth(date: Date) {
	  const year = date.getFullYear();
	  const month = formatTwoDigits(date.getMonth() + 1);
	  return `${year}/${month}`;
	}

	export function dateToYear(date: Date) {
	  return `${date.getFullYear()}`;
	}

	export function formatTwoDigits(number: number) {
	  return number.toLocaleString(undefined, { minimumIntegerDigits: 2 });
	}

	export function roundCurrency(number) {
	  if(!isFinite(number)) {
	    return number;
	  }
	  return Math.round(number * 100) / 100;
	}

	export function monthRange(minDate: Date, maxDate: Date) {
	  const months = [] as string[];
	  const minYear = minDate.getFullYear();
	  const minMonth = minDate.getMonth();
	  const maxYear = maxDate.getFullYear();
	  const maxMonth = maxDate.getMonth();

	  for(let year = minYear; year <= maxYear; ++year) {
	    for(let month = 0; month < 12; ++ month) {
	      if(year === minYear && month < minMonth) {
	        continue;
	      }
	      if(year === maxYear && month > maxMonth) {
	        continue;
	      }

	      months.push(`${year}/${formatTwoDigits(month + 1)}`);
	    }
	  }

	  return months;
	}

	export function yearRange(minDate: Date, maxDate: Date) {
	  const years = [];
	  const minYear = minDate.getFullYear();
	  const maxYear = maxDate.getFullYear();

	  for(let year = minYear; year <= maxYear; ++year) {
	    years.push(`${year}`);
	  }

	  return years;
	}
*/
func createGroupHierarchy(groupCollection store.IContainer[*entities.Group], groupId *string) map[string]struct{} {
	// no criteria
	if groupId == nil {
		return nil
	}

	// unsorted group
	if *groupId == "" {
		return map[string]struct{}{"": {}}
	}

	hierarchy := make(map[string]struct{})
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

/*
export function computeDateRange(criteria, operations) {
  let { minDate, maxDate } = criteria;
  if((!minDate || !maxDate) && operations.size) {
    let computedMinDate = Infinity;
    let computedMaxDate = -Infinity;
    for(const operation of operations.list()) {
      computedMinDate = Math.min(computedMinDate, operation.date);
      computedMaxDate = Math.max(computedMaxDate, operation.date);
    }
    minDate = minDate || new Date(computedMinDate);
    maxDate = maxDate || new Date(computedMaxDate);
  }
  return { minDate, maxDate };
}
*/
