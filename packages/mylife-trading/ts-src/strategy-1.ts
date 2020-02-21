import Strategy from './strategy';
import IgClient from './broker/ig-client';

export default class Strategy1 implements Strategy {
  private client: IgClient;

  async init() {
    this.client = new IgClient(process.env.IGKEY, process.env.IGID, process.env.IGPASS, true);
    await this.client.login();
    console.log('login ok');

    console.log(await this.client.findMarkets('Forex'))
  }

  async terminate() {
    await this.client.logout();
    console.log('logout ok');
  }
}
