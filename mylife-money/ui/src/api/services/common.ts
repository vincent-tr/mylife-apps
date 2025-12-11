import { api } from 'mylife-tools';

export class Common extends api.services.Common {
  async notifyAccounts() {
    return (await this.call({
      service: 'common',
      method: 'notifyAccounts',
    })) as string;
  }

  async notifyGroups() {
    return (await this.call({
      service: 'common',
      method: 'notifyGroups',
    })) as string;
  }
}
