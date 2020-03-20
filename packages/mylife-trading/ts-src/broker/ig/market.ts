/**
 * Client's market order trading preference
 */
export enum MarketOrderPreference {
  /**
   * Market orders are allowed for the account type and instrument, and the user has enabled market orders in their preferences but decided the default state is off.
   */
  AVAILABLE_DEFAULT_OFF = 'AVAILABLE_DEFAULT_OFF',	

  /**
   * Market orders are allowed for the account type and instrument, and the user has enabled market orders in their preferences and has decided the default state is on.
   */
  AVAILABLE_DEFAULT_ON = 'AVAILABLE_DEFAULT_ON',	

  /**
   * Market orders are not allowed for the current site and/or instrument
   */
  NOT_AVAILABLE = 'NOT_AVAILABLE',	
}

/**
 * Describes the dimension for a dealing rule value
 */
export enum DealingRuleUnit {
  PERCENTAGE = 'PERCENTAGE',
  POINTS = 'POINTS'
}

/**
 * Dealing rule
 */
export interface DealingRule {
  /**
   * Describes the dimension for a dealing rule value
   */
  unit: DealingRuleUnit;

  /**
   * Value
   */
  value: number;
}

/**
 * Trailing stops trading preference for the specified market
 */
export enum TrailingStopsPreference {
  /**
   * Trailing stops are allowed for the current market
   */
  AVAILABLE,

  /**
   * Trailing stops are not allowed for the current market
   */
  NOT_AVAILABLE
}

/**
 * Dealing rules
 */
export interface DealingRules {
  /**
   * Client's market order trading preference
   */
  marketOrderPreference: MarketOrderPreference;

  /**
   * Dealing rule
   */
  maxStopOrLimitDistance: DealingRule;

  /**
   * Dealing rule
   */
  minControlledRiskStopDistance: DealingRule;

  /**
   * Dealing rule
   */
  minDealSize: DealingRule;

  /**
   * Dealing rule
   */
  minNormalStopOrLimitDistance: DealingRule;

  /**
   * Dealing rule
   */
  minStepDistance: DealingRule;

  /**
   * Trailing stops trading preference for the specified market
   */
  trailingStopsPreference: TrailingStopsPreference;
}

/**
 * Currency
 */
export interface Currency {
  /**
   * Base exchange rate
   */
  baseExchangeRate: number;	

  /**
   * Code, to be used when placing orders
   */
  code: string;	

  /**
   * Exchange rate.
   */
  exchangeRate: number;	

  /**
   * True if this is the default currency
   */
  isDefault: boolean;

  /**
   * Symbol, for display purposes
   */
  symbol: string;	
}

/**
 * Market expiry details
 */
export interface MarketExpiryDetails {
  /**
   * Last dealing date
   */
  lastDealingDate:string;

  /**
   * Settlement information
   */
  settlementInfo:string;
}

/**
 * Deposit band
 */
export interface DepositBand {
  /**
   * the currency for this currency band factor calculation
   */
  currency:string;

  /**
   * Margin Percentage
   */
  margin: number;

  /**
   * Band maximum
   */
  max: number;

  /**
   * Band minimum
   */
  min: number;
}

/**
 * Time range
 */
export interface TimeRange {
/**
 * Close time
 */
closeTime:string;

/**
 * Open time
 */
openTime:string;
}

/**
 * Market open and close times
 */
export interface OpeningHours {
  /**
   * Time range
   */
  marketTimes: TimeRange[];
}

/**
 * Market rollover details
 */
export interface MarketRolloverDetails {
/**
 * Last rollover date
 */
lastRolloverTime:string;

/**
 * Rollover info
 */
rolloverInfo:string;
}

/**
 * Slippage factor details for a given market
 */
export interface SlippageFactor {
/**
 * Unit
 */
unit:string;

/**
 * Value
 */
value: number;
}

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
 * Unit used to qualify the size of a trade
 */
export enum TradeSizeUnit {
  AMOUNT = 'AMOUNT',	
  CONTRACTS = 'CONTRACTS',	
  SHARES = 'SHARES'
}

/**
 * Instrument details
 */
export interface InstrumentDetails {
  /**
   * Chart code
   */
  chartCode:string;

  /**
   * Contract size
   */
  contractSize:string;

  /**
   * True if controlled risk trades are allowed
   */
  controlledRiskAllowed: boolean;

  /**
   * Country
   */
  country:string;

  /**
   * Currencies
   */
  currencies: Currency[];

  /**
   * Instrument identifier
   */
  epic:string;

  /**
   * Expiry
   */
  expiry:string;

  /**
   * Market expiry details
   */
  expiryDetails: MarketExpiryDetails;

  /**
   * True if force open is allowed
   */
  forceOpenAllowed: boolean;

  /**
   * The limited risk premium.
   */
  limitedRiskPremium: DealingRule;

  /**
   * Lot size
   */
  lotSize: number;

  /**
   * Deposit band
   */
  marginDepositBands: DepositBand[];
  
  /**
   * margin requirement factor
   */
  marginFactor: number;

  /**
   * describes the dimension for a dealing rule value
   */
  marginFactorUnit: DealingRuleUnit;

  /**
   * Market identifier
   */
  marketId:string;

  /**
   * Name
   */
  name:string;

  /**
   * Reuters news code
   */
  newsCode:string;

  /**
   * Meaning of one pip
   */
  onePipMeans:string;

  /**
   * Market open and close times
   */
  openingHours: OpeningHours;

  /**
   * Market rollover details
   */
  rolloverDetails: MarketRolloverDetails;

  /**
   * Slippage factor details for a given market
   */
  slippageFactor: SlippageFactor;

  /**
   * List of special information notices
   */
  specialInfo: string[];

  /**
   * For sprint markets only, the maximum value to be specified as the expiry of a sprint markets trade
   */
  sprintMarketsMaximumExpiryTime:number;

  /**
   * For sprint markets only, the minimum value to be specified as the expiry of a sprint markets trade
   */
  sprintMarketsMinimumExpiryTime:number;
  
  /**
   * True if stops and limits are allowed
   */
  stopsLimitsAllowed:boolean;
  
  /**
   * True if streaming prices are available, i.e. the market is open and the client has appropriate permissions
   */
  streamingPricesAvailable:boolean;

  /**
   * Instrument type
   */
  type: InstrumentType;

  /**
   * Unit used to qualify the size of a trade
   */
  unit: TradeSizeUnit;

  /**
   * Value of one pip
   */
  valueOfOnePip: string;
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
 * Market snapshot data
 */
export interface MarketSnapshotData {
  /**
   * Bid price
   */
  bid: number;

  /**
   * Binary odds
   */
  binaryOdds: number;

  /**
   * the number of points to add on each side of the market as an additional spread when placing a guaranteed stop trade.
   */
  controlledRiskExtraSpread: number;

  /**
   * Number of decimal positions for market levels
   */
  decimalPlacesFactor: number;

  /**
   * Price delay
   */
  delayTime: number;

  /**
   * Highest price on the day
   */
  high: number;

  /**
   * Lowest price on the day
   */
  low: number;

  /**
   * Describes the current status of a given market
   */
  marketStatus: MarketStatus;

  /**
   * Net price change on the day
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
   * Multiplying factor to determine actual pip value for the levels used by the instrument
   */
  scalingFactor: number;

  /**
   * Time of last price update
   */
  updateTime: string;
}

/**
 * Details of the given market.
 */
export interface MarketDetails {
  /**
   * Dealing rules
   */
  dealingRules: DealingRules;

  /**
   * Instrument details
   */
  instrument: InstrumentDetails;

  /**
   * Market snapshot data
   */
  snapshot: MarketSnapshotData;
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

/**
 * Price resolution
 */
export enum PriceResolution {
  MINUTE = 'MINUTE',
  MINUTE_2 = 'MINUTE_2',
  MINUTE_3 = 'MINUTE_3',
  MINUTE_5 = 'MINUTE_5',
  MINUTE_10 = 'MINUTE_10',
  MINUTE_15 = 'MINUTE_15',
  MINUTE_30 = 'MINUTE_30',
  HOUR = 'HOUR',
  HOUR_2 = 'HOUR_2',
  HOUR_3 = 'HOUR_3',
  HOUR_4 = 'HOUR_4',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

/**
 * Historical price data allowance
 */
export interface HistoricalPriceDataAllowance {
  /**
   * 	The number of seconds till the current allowance period will end and the remaining allowance field is reset
   */
  allowanceExpiry: number;

  /**
   * 	The number of data points still available to fetch within the current allowance period
   */
  remainingAllowance: number;

  /**
   * 	The number of data points the API key and account combination is allowed to fetch in any given allowance period
   */
  totalAllowance: number;
}

export interface Price {
  /**
   * Ask price
   */
  ask: number;

  /**
   * Bid price
   */
  bid: number;

  /**
   * Last traded price. This will generally be null for non exchange-traded instruments
   */
  lastTraded: number;
}

export interface MarketPriceSnapshot {
  /**
   * Price
   */
  closePrice: Price;

  /**
   * Price
   */
  highPrice: Price;

  /**
   * Price
   */
  lowPrice: Price;

  /**
   * Price
   */
  openPrice: Price;

  /**
   * Last traded volume. This will generally be null for non exchange-traded instruments
   */
  lastTradedVolume: number;

  /**
   * Snapshot local time, format is yyyy/MM/dd hh:mm:ss
   */
  snapshotTime: string;
}

export interface PriceList {
  /**
   * Historical price data allowance
   */
  allowance: HistoricalPriceDataAllowance;

  /**
   * Instrument type
   */
  instrumentType: InstrumentType;

  /**
   * Historical market price snapshot
   */
  prices: MarketPriceSnapshot[];
}

export class MarketOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

  // marketnavigation	
  // marketnavigation/{nodeId}	
  // markets	

  /**
   * Returns the details of the given market.
   * @param epic 
   */
  async getMarket(epic: string): Promise<MarketDetails> {
    return await this.request('get', `markets/${epic}`, null, '3');
  }

  /**
   * Returns all markets matching the search term.
   * @param keyword
   */
  async findMarkets(keyword: string): Promise<SearchMarketResponse> {
    return await this.request('get', 'markets?searchTerm=' + keyword, null, '1');
  }

  // prices/{epic}

  /**
   * Returns historical prices for a particular instrument.
   * By default returns the minute prices within the last 10 minutes.
   * @param epic Instrument epic
   * @param resolution Price resolution
   * @param numPoints Number of data points required
   */
  async prices(epic: string, resolution: PriceResolution = PriceResolution.MINUTE, numPoints: number = 10): Promise<PriceList> {
    return await this.request('get', `prices/${epic}/${resolution}/${numPoints}`);
  }

  // prices/{epic}/{resolution}/{startDate}/{endDate}	
  // prices/{epic}/{resolution}?startdate={startdate}&enddate={enddate}
}
