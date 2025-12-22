import { api } from 'mylife-tools';

export class UpsMon extends api.services.Service {
  async notify() {
    return (await this.call({
      service: 'upsmon',
      method: 'notify',
    })) as string;
  }
}
