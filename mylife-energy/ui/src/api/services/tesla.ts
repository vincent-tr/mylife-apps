import { api } from 'mylife-tools';
import { TeslaMode } from '..';

export class Tesla extends api.services.Service {
  async setMode(mode: TeslaMode) {
    await this.call({
      service: 'tesla',
      method: 'setMode',
      mode,
    });
  }

  async setParameters({
    fastLimit,
    smartLimitLow,
    smartLimitHigh,
    smartFastCurrent,
  }: {
    fastLimit: number;
    smartLimitLow: number;
    smartLimitHigh: number;
    smartFastCurrent: number;
  }) {
    await this.call({
      service: 'tesla',
      method: 'setParameters',
      fastLimit,
      smartLimitLow,
      smartLimitHigh,
      smartFastCurrent,
    });
  }
}
