import { api } from 'mylife-tools';

export class Updates extends api.services.Service {
  async notify() {
    return (await this.call({
      service: 'updates',
      method: 'notify',
    })) as string;
  }
}
