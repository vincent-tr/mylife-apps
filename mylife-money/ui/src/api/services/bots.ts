import { api } from 'mylife-tools';

export class Bots extends api.services.Service {
  async notifyBots() {
    return (await this.call({
      service: 'bots',
      method: 'notifyBots',
    })) as string;
  }

  async startBot(id: string) {
    await this.call({
      service: 'bots',
      method: 'startBot',
      id,
    });
  }
}
