'use strict';

const { dateToYear, yearRange } = require('./tools');
const { GroupByPeriod } = require('./group-by-period');

exports.GroupByYear = class GroupByYear extends GroupByPeriod {
  constructor() {
    super('report-group-by-year');
  }

  periodRange(minDate, maxDate) {
    return yearRange(minDate, maxDate);
  }

  itemFactory(period) {
    return {
      _id: period,
      year: period,
    };
  }

  dateToPeriod(date) {
    return dateToYear(date);
  }
};
