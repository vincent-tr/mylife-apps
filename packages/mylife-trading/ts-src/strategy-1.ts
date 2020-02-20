import Strategy from './strategy';
import IgClient from './ig-client';

export default class Strategy1 implements Strategy {
  private client: IgClient;

  async init(): Promise<void> {
    this.client = new IgClient(process.env.IGKEY, process.env.IGID, process.env.IGPASS, true);
    await this.client.login();
    console.log('login ok');
  }

  async terminate(): Promise<void> {
  }
}
