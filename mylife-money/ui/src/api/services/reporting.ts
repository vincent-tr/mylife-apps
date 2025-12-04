import { api } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '..';

export class Reporting extends api.services.Service {
  async exportGroupByMonth(criteria: ReportingCriteria, display: ReportingDisplay) {
    return (await this.call({
      service: 'reporting',
      method: 'exportGroupByMonth',
      criteria,
      display,
    })) as string;
  }

  async exportGroupByYear(criteria: ReportingCriteria, display: ReportingDisplay) {
    return (await this.call({
      service: 'reporting',
      method: 'exportGroupByYear',
      criteria,
      display,
    })) as string;
  }
}
