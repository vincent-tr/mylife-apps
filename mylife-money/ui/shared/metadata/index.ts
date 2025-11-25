import datatypes from './datatypes';
import account from './entities/account';
import bot from './entities/bot';
import group from './entities/group';
import operation from './entities/operation';
import reportGroupByPeriod from './entities/report-group-by-period';
import reportOperationStat from './entities/report-operation-stat';
import reportTotalByMonth from './entities/report-total-by-month';

export default {
  datatypes,
  entities: [account, group, operation, bot, reportOperationStat, reportTotalByMonth, reportGroupByPeriod],
};
