import { NagiosHost } from './entities/nagios-host';
import { NagiosHostGroup } from './entities/nagios-host-group';
import { NagiosService } from './entities/nagios-service';

export * from './entities/nagios-host-group';
export * from './entities/nagios-host';
export * from './entities/nagios-service';
export * from './entities/nagios-summary';
export * from './entities/upsmon-status';
export * from './entities/upsmon-summary';
export * from './entities/updates-summary';
export * from './entities/updates-version';

export type NagiosData = NagiosHostGroup | NagiosHost | NagiosService;
