'use strict';

exports.dateToMonth = dateToMonth;
exports.formatTwoDigits = formatTwoDigits;
exports.roundCurrency = roundCurrency;
exports.monthRange = monthRange;
exports.createGroupHierarchy = createGroupHierarchy;

function dateToMonth(date) {
  const year = date.getFullYear();
  const month = formatTwoDigits(date.getMonth() + 1);
  return `${year}/${month}`;
}

function formatTwoDigits(number) {
  return number.toLocaleString(undefined, { minimumIntegerDigits: 2 });
}

function roundCurrency(number) {
  if(!isFinite(number)) {
    return number;
  }
  return Math.round(number * 100) / 100;
}

function monthRange(minDate, maxDate) {
  const months = [];
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


function createGroupHierarchy(groupCollection, groupId) {
  // no criteria
  if(groupId === undefined) {
    return null;
  }

  // unsorted group
  if(!groupId) {
    return new Set([null]);
  }

  const hierarchy = new Set();
  const groupIdsToProcess = new Set();
  groupIdsToProcess.add(groupId);

  while(groupIdsToProcess.size) {
    const id = groupIdsToProcess.values().next().value;
    groupIdsToProcess.delete(id);
    hierarchy.add(id);

    for(const group of groupCollection.list()) {
      if(group.parent === id) {
        groupIdsToProcess.add(group._id);
      }
    }
  }

  return hierarchy;
}
