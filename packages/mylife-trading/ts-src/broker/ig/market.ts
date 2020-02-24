/**
 * Instrument type
 */
export enum InstrumentType {

  /**
   * Binaries
   */
  BINARY = 'BINARY',

  /**
   * Capped bungees
   */
  BUNGEE_CAPPED = 'BUNGEE_CAPPED',

  /**
   * Commodity bungees
   */
  BUNGEE_COMMODITIES = 'BUNGEE_COMMODITIES',

  /**
   * Currency bungees
   */
  BUNGEE_CURRENCIES = 'BUNGEE_CURRENCIES',

  /**
   * Index bungees
   */
  BUNGEE_INDICES = 'BUNGEE_INDICES',

  /**
   * Commodities
   */
  COMMODITIES = 'COMMODITIES',

  /**
   * Currencies
   */
  CURRENCIES = 'CURRENCIES',

  /**
   * Indices
   */
  INDICES = 'INDICES',

  /**
   * Commodity options
   */
  OPT_COMMODITIES = 'OPT_COMMODITIES',

  /**
   * Currency options
   */
  OPT_CURRENCIES = 'OPT_CURRENCIES',

  /**
   * Index options
   */
  OPT_INDICES = 'OPT_INDICES',

  /**
   * FX options
   */
  OPT_RATES = 'OPT_RATES',

  /**
   * Share options
   */
  OPT_SHARES = 'OPT_SHARES',

  /**
   * Rates
   */
  RATES = 'RATES',

  /**
   * Sectors
   */
  SECTORS = 'SECTORS',

  /**
   * Shares
   */
  SHARES = 'SHARES',

  /**
   * Sprint Market
   */
  SPRINT_MARKET = 'SPRINT_MARKET',

  /**
   * Test market
   */
  TEST_MARKET = 'TEST_MARKET',

  /**
   * Unknown
   */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Describes the current status of a given market
 */
export enum MarketStatus {
  /**
   * Closed
   */
  CLOSED = 'CLOSED',

  /**
   * Open for edits
   */
  EDITS_ONLY = 'EDITS_ONLY',

  /**
   * Offline
   */
  OFFLINE = 'OFFLINE',

  /**
   * In auction mode
   */
  ON_AUCTION = 'ON_AUCTION',

  /**
   * In no-edits mode
   */
  ON_AUCTION_NO_EDITS = 'ON_AUCTION_NO_EDITS',

  /**
   * Suspended
   */
  SUSPENDED = 'SUSPENDED',

  /**
   * Open for trades
   */
  TRADEABLE = 'TRADEABLE',
}

/**
 * Market data
 */
export interface Market {
  /**
   * Bid price
   */
  bid: number;

  /**
 * Price delay time in minutes
 */
  delayTime: number;

  /**
 * Instrument epic identifier
 */
  epic: string;

  /**
 * Instrument expiry period
 */
  expiry: string;

  /**
   * Highest price of the day
   */
  high: number;

  /**
   * Instrument name
   */
  instrumentName: string;

  /**
   * Instrument type
   */
  instrumentType: InstrumentType;

  /**
   * Lowest price of the day
   */
  low: number;

  /**
   * Describes the current status of a given market
   */
  marketStatus: MarketStatus;

  /**
   * Price net change
   */
  netChange: number;

  /**
   * Offer price
   */
  offer: number;

  /**
   * Percentage price change on the day
   */
  percentageChange: number;

  /**
   * multiplying factor to determine actual pip value for the levels used by the instrument
   */
  scalingFactor: number;

  /**
   * True if streaming prices are available, i.e.if the market is tradeable and the client has appropriate permissions
   */
  streamingPricesAvailable: boolean;

  /**
   * Local time of last price update
   */
  updateTime: string;

  /**
   * Time of last price update
   */
  updateTimeUTC: string;
}

export interface SearchMarketResponse {
  markets: Market[];
}

export class MarketOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

  // marketnavigation	
  // marketnavigation/{nodeId}	
  // markets	
  // markets/{epic}

  /**
   * Returns all markets matching the search term.
   * @param keyword
   */
  async findMarkets(keyword: string): Promise<SearchMarketResponse> {
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

  // prices/{epic}/{resolution}/{numPoints}	
  // prices/{epic}/{resolution}/{startDate}/{endDate}	
  // prices/{epic}/{resolution}?startdate={startdate}&enddate={enddate}
}
