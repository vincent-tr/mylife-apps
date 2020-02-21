import IgConnection from './ig-connection';

export default class IgClient extends IgConnection {
  /**
   * Creates a trading session, obtaining session tokens for subsequent API access
   */
  async sessionEncryptionKey() {
    return await this.request('post', 'session/encryptionKey', null, '1');
  }

  /**
   * Returns a list of accounts belonging to the logged-in client
   */
  async accounts() {
    return await this.request('get', 'accounts', null, '1');
  }

  /**
   * Returns the account activity history.
   */
  async accountHistory() {
    return await this.request('get', 'history/activity', null, '3');
  }

  /**
   * Returns the account activity history.
   */
  async accountHistory2() {
    return await this.request('get', 'history/activity/2000', null, '3');
  }

  /**
   * Returns the transaction history. By default returns the minute prices within the last 10 minutes.
   */
  async accountTransactions() {
    return await this.request('get', 'history/transactions');
  }

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
