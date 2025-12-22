import { api } from 'mylife-tools';

export class Nagios extends api.services.Service {
  async notify() {
    return (await this.call({
      service: 'nagios',
      method: 'notify',
    })) as string;
  }
}
