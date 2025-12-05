import { api } from 'mylife-tools';

export class Live extends api.services.Service {
  async notifyDevices() {
    return (await this.call({
      service: 'live',
      method: 'notifyDevices',
    })) as string;
  }

  async notifyMeasures() {
    return (await this.call({
      service: 'live',
      method: 'notifyMeasures',
    })) as string;
  }
}
