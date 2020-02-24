
export class DealingOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

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
}
