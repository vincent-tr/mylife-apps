import Connection from './connection';
import { AccountOperations } from './account';
import { DealingOperations } from './dealing';
import { MarketOperations } from './market';

export default class Client extends Connection {

  public readonly account: AccountOperations = new AccountOperations((...args) => this.request(...args));
  public readonly dealing: DealingOperations = new DealingOperations((...args) => this.request(...args));
  public readonly market: MarketOperations = new MarketOperations((...args) => this.request(...args));
}
