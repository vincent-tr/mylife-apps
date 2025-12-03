import { Service } from './service';

export class Common extends Service {
  async unnotify(viewId: string) {
    await this.call({
      service: 'common',
      method: 'unnotify',
      viewId,
    });
  }

  async renotifyWithCriteria(viewId: string, criteria: unknown) {
    await this.call({
      service: 'common',
      method: 'renotifyWithCriteria',
      viewId,
      criteria,
    });
  }
}
