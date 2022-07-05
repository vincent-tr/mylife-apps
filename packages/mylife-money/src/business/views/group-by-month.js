'use strict';

const { dateToMonth, monthRange } = require('./tools');
const { GroupByPeriod } = require('./group-by-period');

exports.GroupByMonth = class GroupByMonth extends GroupByPeriod {
  constructor() {
    super('report-group-by-month');
  }

  periodRange(minDate, maxDate) {
    return monthRange(minDate, maxDate);
  }

  itemFactory(period) {
    return {
      _id: period,
      month: period,
    };
  }

  dateToPeriod(date) {
    return dateToMonth(date);
  }
};
