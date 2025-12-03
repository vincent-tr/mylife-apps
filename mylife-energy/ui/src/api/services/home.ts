import { api } from 'mylife-tools';

export class Home extends api.services.Service {
  async notifyHomeData() {
    return (await this.call({
      service: 'home',
      method: 'notifyHomeData',
    })) as string;
  }
}
