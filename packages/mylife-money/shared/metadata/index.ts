import datatypes from './datatypes';

import account from'./entities/account';
import group from'./entities/group';
import operation from'./entities/operation';
import bot from'./entities/bot';
import botRun from'./entities/bot-run';
import reportOperationStat from'./entities/report-operation-stat';
import reportTotalByMonth from'./entities/report-total-by-month';
import reportGroupByPeriod from'./entities/report-group-by-period';

export default {
  datatypes,
  entities: [
    account,
    group,
    operation,
    bot,
    botRun,
    reportOperationStat,
    reportTotalByMonth,
    reportGroupByPeriod,
  ]
};
