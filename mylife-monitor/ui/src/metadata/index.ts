import nagiosHost from './entities/nagios-host';
import nagiosHostGroup from './entities/nagios-host-group';
import nagiosService from './entities/nagios-service';
import nagiosSummary from './entities/nagios-summary';
import updatesSummary from './entities/updates-summary';
import updatesVersion from './entities/updates-version';
import upsmonStatus from './entities/upsmon-status';
import upsmonSummary from './entities/upsmon-summary';
import datatypes from './datatypes';

export default {
  datatypes,
  entities: [nagiosHostGroup, nagiosHost, nagiosService, nagiosSummary, upsmonStatus, upsmonSummary, updatesSummary, updatesVersion],
};
