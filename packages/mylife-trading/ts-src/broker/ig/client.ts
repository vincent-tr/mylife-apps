import Connection from './connection';
import { AccountOperations } from './account';

export default class Client extends Connection {

  public readonly account: AccountOperations = new AccountOperations((...args) => this.request(...args));

  /** Dealing */

  /**
   * Returns all open positions for the active account.
   */
  async positions() {
    return await this.request('get', 'positions');
  }

  /**
   * @param data
   */
  async openPosition(data: any) {
    return await this.request('post', 'positions/otc', data);
  }

  /**
   * Returns all open sprint market positions for the active account.
   */
  async positionsSprintMarkets() {
    return await this.request('get', 'positions/sprintmarkets');
  }

  /**
   * Returns all open working orders for the active account.
   */
  async workingOrders() {
    return await this.request('get', 'workingorders');
  }

  /** Markets */

  /**
   * Returns all markets matching the search term.
   * @param keyword
   */
  async findMarkets(keyword: string) {
    return await this.request('get', 'markets?searchTerm=' + keyword, null, '1');
  }

  /**
   * Returns historical prices for a particular instrument.
   * By default returns the minute prices within the last 10 minutes.
   * @param epic
   */

  async prices(epic: string) {
    return await this.request('get', 'prices/' + epic, null, '3');
  }

  /** Watchlists */

  /***
   * Returns all watchlists belonging to the active account.
   */
  async watchlists() {
    return await this.request('get', 'watchlists', null, '1');
  }
}
