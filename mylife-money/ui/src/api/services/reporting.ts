import { api } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '..';

export class Reporting extends api.services.Service {
  async notifyOperationStats() {
    return (await this.call({
      service: 'reporting',
      method: 'notifyOperationStats',
    })) as string;
  }

  async notifyTotalByMonth() {
    return (await this.call({
      service: 'reporting',
      method: 'notifyTotalByMonth',
    })) as string;
  }

  async notifyGroupByMonth(criteria: ReportingCriteria) {
    return (await this.call({
      service: 'reporting',
      method: 'notifyGroupByMonth',
      criteria,
    })) as string;
  }

  async notifyGroupByYear(criteria: ReportingCriteria) {
    return (await this.call({
      service: 'reporting',
      method: 'notifyGroupByYear',
      criteria,
    })) as string;
  }

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
