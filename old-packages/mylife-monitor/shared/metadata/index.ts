import datatypes from './datatypes';

import nagiosHostGroup from './entities/nagios-host-group';
import nagiosHost from './entities/nagios-host';
import nagiosService from './entities/nagios-service';
import nagiosSummary from './entities/nagios-summary';

export default {
  datatypes,
  entities: [
    nagiosHostGroup,
    nagiosHost,
    nagiosService,
    nagiosSummary,
  ]
};
