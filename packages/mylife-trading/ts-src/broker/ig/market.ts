
export class MarketOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

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
