import { api } from 'mylife-tools';

export class Common extends api.services.Common {
  async notifyAccounts() {
    return (await this.call({
      service: 'bots',
      method: 'notifyBots',
    })) as string;
  }

  async notifyGroups() {
    return (await this.call({
      service: 'bots',
      method: 'notifyGroups',
    })) as string;
  }
}
