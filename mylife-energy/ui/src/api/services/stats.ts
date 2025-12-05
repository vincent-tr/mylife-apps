import { api } from 'mylife-tools';
import { StatsType, StatValue } from '..';

export class Stats extends api.services.Service {
  async getValues({ type, timestamp, sensors }: { type: StatsType; timestamp: Date; sensors: string[] }) {
    return (await this.call({
      service: 'stats',
      method: 'getValues',
      type,
      timestamp,
      sensors,
      timeout: 60000, // can be slower for now as we request long db queries
    })) as StatValue[];
  }

  async notifyDevices() {
    return (await this.call({
      service: 'stats',
      method: 'notifyDevices',
    })) as string;
  }
}
