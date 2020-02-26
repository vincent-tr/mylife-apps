import { Market } from './market';

/**
 * Market data
 */
export interface MarketPosition extends Market {
  /**
   * 	Instrument lot size
   */
  lotSize: number;
}

/**
 * Deal direction
 */
export enum DealDirection {
  /**
   * Buy
   */
  BUY = 'BUY',

  /**
   * Sell
   */
  SELL = 'SELL'
}

/**
 * The time in force determines the order fill strategy.
 */
export enum TimeInForce {
  /**
   * Execute and eliminate
   */
  EXECUTE_AND_ELIMINATE = 'EXECUTE_AND_ELIMINATE',

  /**
   * Fill or kill
   */
  FILL_OR_KILL = 'FILL_OR_KILL'
}

/**
 * Describes the order level model to be used for a position operation
 */
export enum OrderType {

  /**
   * Limit orders get executed at the price seen by IG at the moment of booking a trade.
   * A limit determines the level at which the order or the remainder of the order will be rejected.
   */
  LIMIT = 'LIMIT',

  /**
   * Market orders get executed at the price seen by the IG at the time of booking the trade.
   * A level cannot be specified.Not applicable to BINARY instruments
   */
  MARKET = 'MARKET',

  /**
   * Quote orders get executed at the specified level.
   * The level has to be accompanied by a valid quote id.
   * This type is only available subject to agreement with IG.
   */
  QUOTE = 'QUOTE'
}


export interface Position {
  /**
   * Size of the contract
   */
  contractSize: number;

  /**
   * True if position is risk controlled
   */
  controlledRisk: boolean;

  /**
   * Local date the position was opened
   */
  createdDate: string;

  /**
   * Date the position was opened
   */
  createdDateUTC: string;

  /**
   * Position currency ISO code
   */
  currency: string;

  /**
   * Deal identifier
   */
  dealId: string;

  /**
   * Deal reference
   */
  dealReference: string;

  /**
   * Deal direction
   */
  direction: DealDirection;

  /**
   * Level at which the position was opened
   */
  level: number;

  /**
   * Limit level
   */
  limitLevel: number;

  /**
   * Deal size
   */
  size: number;

  /**
   * Stop level
   */
  stopLevel: number;

  /**
   * Trailing step size
   */
  trailingStep: number;

  /**
   * Trailing stop distance
   */
  trailingStopDistance: number;
}

/**
 * Open position data
 */
export interface OpenPositionData {
  /**
   * Market data
   */
  market: MarketPosition;

  /**
   * Position data
   */
  position: Position;
}

export interface OpenPositionOrder {
  /**
   * Currency.
   * Restricted to available instrument currencies
   */
  currencyCode: string;

  /**
   * A user - defined reference identifying the submission of the order
   */
  dealReference: string;

  /**
   * Deal direction
   */
  direction: DealDirection;

  /**
   * Instrument epic identifier
   */
  epic: string;

  /**
   * Instrument expiry
   */
  expiry: string;

  /**
   * True if force open is required
   */
  forceOpen: boolean;

  /**
   * True if a guaranteed stop is required
   */
  guaranteedStop: boolean;

  /**
   * Deal level
   */
  level: number;

  /**
   * Limit distance
   */
  limitDistance: number;

  /**
   * Limit level
   */
  limitLevel: number;

  /**
   * Describes the order level model to be used for a position operation
   */
  orderType: OrderType;

  /**
   * Lightstreamer price quote identifier
   */
  quoteId: string;

  /**
   * Deal size
   */
  size: number;

  /**
  * Stop distance
  */
  stopDistance: number;

  /**
   * Stop level
   */
  stopLevel: number;

  /**
   * The time in force determines the order fill strategy.
   */
  timeInForce: TimeInForce;

  /**
   * Whether the stop has to be moved towards the current level in case of a favourable trade
   */
  trailingStop: boolean;

  /**
   * increment step in pips for the trailing stop
   */
  trailingStopIncrement: number;
}

export interface UpdatePositionOrder {
  /**
   * Limit level
   */
  limitLevel: number;

  /**
   * Stop level
   */
  stopLevel: number;

  /**
   * Whether the stop has to be moved towards the current level in case of a favourable trade
   */
  trailingStop: boolean;

  /**
   * Trailing stop distance
   */
  trailingStopDistance: number;

  /**
   * increment step in pips for the trailing stop
   */
  trailingStopIncrement: number;
}

export interface DealConfirmation {
  // TODO
}

export class DealingOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

  /**
   * Returns an open position for the active account by deal identifier.
   * @param dealId deal identifier
   */
  async position(dealId: string): Promise<OpenPositionData> {
    return await this.request('get', `positions/${dealId}`);
  }

  /**
   * Creates an OTC position.
   * @param data
   * @returns Deal reference of the transaction
   */
  async openPosition(order: OpenPositionOrder): Promise<string> {
    const { dealReference } = await this.request('post', 'positions/otc', order);
    return dealReference;
  }

  /**
   * Closes an OTC position
   * @param dealId Deal identifier
   * @returns Deal reference
   */
  async closePosition(dealId: string): Promise<string> {
    const data = { dealId };
    const { dealReference } = await this.request('delete', 'positions/otc', data, '1');
    return dealReference;
  }

  /**
   * Updates an OTC position.
   * @param dealId Deal identifier
   * @returns Deal reference
   */
  async updatePosition(dealId: string, order: UpdatePositionOrder): Promise<string> {
    const { dealReference } = await this.request('put', `positions/otc/${dealId}`, order);
    return dealReference;
  }

  /**
   * Returns a deal confirmation for the given deal reference.
   * @param dealReference Deal reference
   * @returns Deal confirmation
   */
  async confirm(dealReference: string) : Promise<DealConfirmation> {
    return await this.request('put', `confirms/${dealReference}`, null, '1');
  }
}
