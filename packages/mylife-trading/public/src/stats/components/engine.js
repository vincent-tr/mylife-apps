'use strict';

import { formatDate } from 'mylife-tools-ui';

export function computeData(statView, criteria) {
  if(!criteria.strategy) {
    return [];
  }

  const stats = statView.valueSeq().filter(stat => stat.strategy === criteria.strategy);
  const { minDate, maxDate } = getMinMaxDates(stats);

  const groupFactory = groupFactories[criteria.groupBy];
  const groups = groupFactory.createGroups(minDate, maxDate);

  const buckets = new Map();
  for(const group of groups) {
    buckets.set(group, []);
  }

  stats.forEach(stat => {
    const group = groupFactory.getGroup(stat.openDate);
    const bucket = buckets.get(group);
    bucket.push(stat);
  });

  const aggregator = aggregators[criteria.aggregation];

  for(const [group, stats] of buckets.entries()) {
    buckets.set(group, aggregator(stats));
  }

  return groups.map(group => ({
    date: group,
    value: buckets.get(group)
  }));
}

const MAX_DATE = 8640000000000000;
const MIN_DATE = -8640000000000000;
const DAY = 86400000;

const WEEK_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function getMinMaxDates(stats) {
  let minDate = MAX_DATE;
  let maxDate = MIN_DATE;

  stats.forEach(stat => {
    minDate = Math.min(minDate, stat.openDate);
    maxDate = Math.max(maxDate, stat.openDate);
  });

  return {
    minDate: new Date(minDate),
    maxDate: new Date(maxDate)
  };
}

const groupFactories = {

  day: {
    createGroups(minDate, maxDate) {
      const groups = [];
      for(let current = dateOnly(minDate); current <= dateOnly(maxDate); current = dateAdd(current, DAY)) {
        groups.push(this.getGroup(current));
      }
      return groups;
    },

    getGroup(date) {
      return formatDate(date, 'yyyy-MM-dd');
    }
  },

  month: {
    createGroups(minDate, maxDate) {
      // not very efficient but ..
      const groups = [];
      const set = new Set();
      for(let current = minDate; current <= maxDate; current = dateAdd(current, DAY * 15)) {
        const group = this.getGroup(current);
        if(!set.has(group)) {
          set.add(group);
          groups.push(group);
        }
      }

      const group = this.getGroup(maxDate);
      if(!set.has(group)) {
        set.add(group);
        groups.push(group);
      }
      
      return groups;
    },

    getGroup(date) {
      return formatDate(date, 'yyyy-MM');
    }
  },

  year: {
    createGroups(minDate, maxDate) {
      const groups = [];
      for(let current = minDate.getFullYear(); current <= maxDate.getFullYear(); ++current) {
        groups.push(this.getGroup(new Date(current, 1, 1)));
      }
      return groups;
    },

    getGroup(date) {
      return formatDate(date, 'yyyy');
    }
  },

  'day-hour': {
    createGroups(/*minDate, maxDate*/) {
      const groups = [];
      for(let current = 0; current < 24; ++current) {
        groups.push(`${current}H - ${current+1}H`);
      }
      return groups;
    },

    getGroup(date) {
      const hour = date.getHours();
      return `${hour}H - ${hour+1}H`;
    }
  },

  'week-day': {
    createGroups(/*minDate, maxDate*/) {
      const groups = [];
      for(let current = 0; current < 7; ++current) {
        groups.push(WEEK_DAYS[current]);
      }
      // sunday is last
      const sunday = groups.shift();
      groups.push(sunday);
      return groups;
    },

    getGroup(date) {
      const weekDay = date.getDay();
      return WEEK_DAYS[weekDay];
    }
  }
};

const aggregators = {
  count(stats) {
    return stats.length;
  },
  sum(stats) {
    return round(stats.reduce((acc, stat) => acc + stat.profitAndLoss, 0), 2);
  },
  average(stats) {
    const count = aggregators.count(stats);
    const sum = aggregators.sum(stats);
    return round(sum / count, 5);
  },
  sumMax(stats) {
    sortByDate(stats);

    let max = Number.MIN_SAFE_INTEGER;
    let sum = 0;
    for(const stat of stats) {
      sum += stat.profitAndLoss;
      max = Math.max(sum, max);
    }

    return round(max, 2);
  },
  sumMin(stats) {
    sortByDate(stats);

    let min = Number.MAX_SAFE_INTEGER;
    let sum = 0;
    for(const stat of stats) {
      sum += stat.profitAndLoss;
      min = Math.min(sum, min);
    }

    return round(min, 2);
  }
};

function dateOnly(value) {
  return new Date(value.getFullYear(),value.getMonth() , value.getDate());
}

function dateAdd(date, value) {
  return new Date(date.getTime() + value);
}

function round(value, decimalCount) {
  const factor = Math.pow(10, decimalCount);
  return Math.round(factor * value) / factor;
}

function sortByDate(stats) {
  stats.sort((s1, s2) => s1.openDate - s2.openDate);
}