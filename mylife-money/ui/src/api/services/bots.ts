import { api } from 'mylife-tools';

export class Bots extends api.services.Service {
  async startBot(id: string) {
    await this.call({
      service: 'bots',
      method: 'startBot',
      id,
    });
  }
}
