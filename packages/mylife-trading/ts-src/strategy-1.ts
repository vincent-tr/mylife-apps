import Strategy from './strategy';
import Client from './broker/ig/client';

export default class Strategy1 implements Strategy {
  private client: Client;

  async init() {
    this.client = new Client(process.env.IGKEY, process.env.IGID, process.env.IGPASS, true);
    await this.client.login();
    console.log('login ok');

    console.log(await this.client.findMarkets('EURUSD'))
  }

  async terminate() {
    await this.client.logout();
    console.log('logout ok');
  }
}
