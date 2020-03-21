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
   * A level cannot be specified.
   * Not applicable to BINARY instruments
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
  currencyCode?: string;

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
  level?: number;

  /**
   * Limit distance
   */
  limitDistance?: number;

  /**
   * Limit level
   */
  limitLevel?: number;

  /**
   * Describes the order level model to be used for a position operation
   */
  orderType: OrderType;

  /**
   * Lightstreamer price quote identifier
   */
  quoteId?: string;

  /**
   * Deal size
   */
  size?: number;

  /**
  * Stop distance
  */
  stopDistance?: number;

  /**
   * Stop level
   */
  stopLevel?: number;

  /**
   * The time in force determines the order fill strategy.
   */
  timeInForce?: TimeInForce;

  /**
   * Whether the stop has to be moved towards the current level in case of a favourable trade
   */
  trailingStop?: boolean;

  /**
   * increment step in pips for the trailing stop
   */
  trailingStopIncrement?: number;
}

export interface UpdatePositionOrder {
  /**
   * Limit level
   */
  limitLevel?: number;

  /**
   * Stop level
   */
  stopLevel?: number;

  /**
   * Whether the stop has to be moved towards the current level in case of a favourable trade
   */
  trailingStop?: boolean;

  /**
   * Trailing stop distance
   */
  trailingStopDistance?: number;

  /**
   * increment step in pips for the trailing stop
   */
  trailingStopIncrement?: number;
}

/**
 * Deal status
 */
export enum DealAffection {
  /**
   * Amended
   */
  AMENDED = 'AMENDED',

  /**
   * Deleted
   */
  DELETED = 'DELETED',

  /**
   * Fully closed
   */
  FULLY_CLOSED = 'FULLY_CLOSED',

  /**
   * Opened
   */
  OPENED = 'OPENED',

  /**
   * Partially closed
   */
  PARTIALLY_CLOSED = 'PARTIALLY_CLOSED'
}

/**
 * Affected deal
 */
export interface AffectedDeal {
  /**
   * Deal identifier
   */
  dealId: string,

  /**
   * Deal status
   */
  status: DealAffection;
}

/**
 * Deal status
 */
export enum DealStatus {
  /**
   * Accepted
   */
  ACCEPTED = 'ACCEPTED',

  /**
   * Rejected
   */
  REJECTED = 'REJECTED'
}

/**
 * Describes the error (or success) condition for the specified trading operation
 */
export enum ConfirmReason {

  /**
   * The account is not enabled to trade
   */
  ACCOUNT_NOT_ENABLED_TO_TRADING = 'ACCOUNT_NOT_ENABLED_TO_TRADING',

  /**
   * The level of the attached stop or limit is not valid
   */
  ATTACHED_ORDER_LEVEL_ERROR = 'ATTACHED_ORDER_LEVEL_ERROR',

  /**
   * The trailing stop value is invalid
   */
  ATTACHED_ORDER_TRAILING_STOP_ERROR = 'ATTACHED_ORDER_TRAILING_STOP_ERROR',

  /**
   * Cannot change the stop type.
   */
  CANNOT_CHANGE_STOP_TYPE = 'CANNOT_CHANGE_STOP_TYPE',

  /**
   * Cannot remove the stop.
   */
  CANNOT_REMOVE_STOP = 'CANNOT_REMOVE_STOP',

  /**
   * We are not taking opening deals on a Controlled Risk basis on this market
   */
  CLOSING_ONLY_TRADES_ACCEPTED_ON_THIS_MARKET = 'CLOSING_ONLY_TRADES_ACCEPTED_ON_THIS_MARKET',

  /**
   * Resubmitted request does not match the original order.
   */
  CONFLICTING_ORDER = 'CONFLICTING_ORDER',

  /**
   * Instrument has an error - check the order's currency is the instrument's currency (see the market's details); otherwise please contact support.
   */
  CONTACT_SUPPORT_INSTRUMENT_ERROR = 'CONTACT_SUPPORT_INSTRUMENT_ERROR',

  /**
   * Sorry we are unable to process this order. The stop or limit level you have requested is not a valid trading level in the underlying market.
   */
  CR_SPACING = 'CR_SPACING',

  /**
   * The order has been rejected as it is a duplicate of a previously issued order
   */
  DUPLICATE_ORDER_ERROR = 'DUPLICATE_ORDER_ERROR',

  /**
   * Exchange check failed. Please call in for assistance.
   */
  EXCHANGE_MANUAL_OVERRIDE = 'EXCHANGE_MANUAL_OVERRIDE',

  /**
   * Order expiry is less than the sprint market's minimum expiry. Check the sprint market's market details for the allowable expiries.
   */
  EXPIRY_LESS_THAN_SPRINT_MARKET_MIN_EXPIRY = 'EXPIRY_LESS_THAN_SPRINT_MARKET_MIN_EXPIRY',

  /**
   * The total size of deals placed on this market in a short period has exceeded our limits. Please wait before attempting to open further positions on this market.
   */
  FINANCE_REPEAT_DEALING = 'FINANCE_REPEAT_DEALING',

  /**
   * Ability to force open in different currencies on same market not allowed
   */
  FORCE_OPEN_ON_SAME_MARKET_DIFFERENT_CURRENCY = 'FORCE_OPEN_ON_SAME_MARKET_DIFFERENT_CURRENCY',

  /**
   * an error has occurred but no detailed information is available. Check transaction history or contact support for further information
   */
  GENERAL_ERROR = 'GENERAL_ERROR',

  /**
   * The working order has been set to expire on a past date
   */
  GOOD_TILL_DATE_IN_THE_PAST = 'GOOD_TILL_DATE_IN_THE_PAST',

  /**
   * The requested market was not found
   */
  INSTRUMENT_NOT_FOUND = 'INSTRUMENT_NOT_FOUND',

  /**
   * The account has not enough funds available for the requested trade
   */
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

  /**
   * The market level has moved and has been rejected
   */
  LEVEL_TOLERANCE_ERROR = 'LEVEL_TOLERANCE_ERROR',

  /**
   * The deal has been rejected because the limit level is inconsistent with current market price given the direction.
   */
  LIMIT_ORDER_WRONG_SIDE_OF_MARKET = 'LIMIT_ORDER_WRONG_SIDE_OF_MARKET',

  /**
   * The manual order timeout limit has been reached
   */
  MANUAL_ORDER_TIMEOUT = 'MANUAL_ORDER_TIMEOUT',

  /**
   * Order declined during margin checks Check available funds.
   */
  MARGIN_ERROR = 'MARGIN_ERROR',

  /**
   * The market is currently closed
   */
  MARKET_CLOSED = 'MARKET_CLOSED',

  /**
   * The market is currently closed with edits
   */
  MARKET_CLOSED_WITH_EDITS = 'MARKET_CLOSED_WITH_EDITS',

  /**
   * The epic is due to expire shortly, client should deal in the next available contract.
   */
  MARKET_CLOSING = 'MARKET_CLOSING',

  /**
   * The market does not allow opening shorting positions
   */
  MARKET_NOT_BORROWABLE = 'MARKET_NOT_BORROWABLE',

  /**
   * The market is currently offline
   */
  MARKET_OFFLINE = 'MARKET_OFFLINE',

  /**
   * The epic does not support 'Market' order type
   */
  MARKET_ORDERS_NOT_ALLOWED_ON_INSTRUMENT = 'MARKET_ORDERS_NOT_ALLOWED_ON_INSTRUMENT',

  /**
   * The market can only be traded over the phone
   */
  MARKET_PHONE_ONLY = 'MARKET_PHONE_ONLY',

  /**
   * The market has been rolled to the next period
   */
  MARKET_ROLLED = 'MARKET_ROLLED',

  /**
   * The requested market is not allowed to this account
   */
  MARKET_UNAVAILABLE_TO_CLIENT = 'MARKET_UNAVAILABLE_TO_CLIENT',

  /**
   * The order size exceeds the instrument's maximum configured value for auto-hedging the exposure of a deal
   */
  MAX_AUTO_SIZE_EXCEEDED = 'MAX_AUTO_SIZE_EXCEEDED',

  /**
   * The order size is too small
   */
  MINIMUM_ORDER_SIZE_ERROR = 'MINIMUM_ORDER_SIZE_ERROR',

  /**
   * The limit level you have requested is closer to the market level than the existing stop. When the market is closed you can only move the limit order further away from the current market level.
   */
  MOVE_AWAY_ONLY_LIMIT = 'MOVE_AWAY_ONLY_LIMIT',

  /**
   * The stop level you have requested is closer to the market level than the existing stop level. When the market is closed you can only move the stop level further away from the current market level
   */
  MOVE_AWAY_ONLY_STOP = 'MOVE_AWAY_ONLY_STOP',

  /**
   * The order level you have requested is moving closer to the market level than the exisiting order level. When the market is closed you can only move the order further away from the current market level.
   */
  MOVE_AWAY_ONLY_TRIGGER_LEVEL = 'MOVE_AWAY_ONLY_TRIGGER_LEVEL',

  /**
   * Opening CR position in opposite direction to existing CR position not allowed.
   */
  OPPOSING_DIRECTION_ORDERS_NOT_ALLOWED = 'OPPOSING_DIRECTION_ORDERS_NOT_ALLOWED',

  /**
   * The deal has been rejected to avoid having long and short open positions on the same market or having long and short open positions and working orders on the same epic
   */
  OPPOSING_POSITIONS_NOT_ALLOWED = 'OPPOSING_POSITIONS_NOT_ALLOWED',

  /**
   * Order declined; please contact Support
   */
  ORDER_DECLINED = 'ORDER_DECLINED',

  /**
   * The order is locked and cannot be edited by the user
   */
  ORDER_LOCKED = 'ORDER_LOCKED',

  /**
   * The order has not been found
   */
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',

  /**
   * The total position size at this stop level is greater than the size allowed on this market. Please reduce the size of the order.
   */
  OVER_NORMAL_MARKET_SIZE = 'OVER_NORMAL_MARKET_SIZE',

  /**
   * Position cannot be deleted as it has been partially closed.
   */
  PARTIALY_CLOSED_POSITION_NOT_DELETED = 'PARTIALY_CLOSED_POSITION_NOT_DELETED',

  /**
   * The deal has been rejected because of an existing position. Either set the 'force open' to be true or cancel opposing position
   */
  POSITION_ALREADY_EXISTS_IN_OPPOSITE_DIRECTION = 'POSITION_ALREADY_EXISTS_IN_OPPOSITE_DIRECTION',

  /**
   * Position cannot be cancelled. Check transaction history or contact support for further information.
   */
  POSITION_NOT_AVAILABLE_TO_CANCEL = 'POSITION_NOT_AVAILABLE_TO_CANCEL',

  /**
   * Cannot close this position. Either the position no longer exists, or the size available to close is less than the size specified.
   */
  POSITION_NOT_AVAILABLE_TO_CLOSE = 'POSITION_NOT_AVAILABLE_TO_CLOSE',

  /**
   * The position has not been found
   */
  POSITION_NOT_FOUND = 'POSITION_NOT_FOUND',

  /**
   * Invalid attempt to submit a CFD trade on a spreadbet account
   */
  REJECT_CFD_ORDER_ON_SPREADBET_ACCOUNT = 'REJECT_CFD_ORDER_ON_SPREADBET_ACCOUNT',

  /**
   * Invalid attempt to submit a spreadbet trade on a CFD account
   */
  REJECT_SPREADBET_ORDER_ON_CFD_ACCOUNT = 'REJECT_SPREADBET_ORDER_ON_CFD_ACCOUNT',

  /**
   * Order size is not an increment of the value specified for the market.
   */
  SIZE_INCREMENT = 'SIZE_INCREMENT',

  /**
   * The expiry of the position would have fallen after the closing time of the market
   */
  SPRINT_MARKET_EXPIRY_AFTER_MARKET_CLOSE = 'SPRINT_MARKET_EXPIRY_AFTER_MARKET_CLOSE',

  /**
   * The market does not allow stop or limit attached orders
   */
  STOP_OR_LIMIT_NOT_ALLOWED = 'STOP_OR_LIMIT_NOT_ALLOWED',

  /**
   * The order requires a stop
   */
  STOP_REQUIRED_ERROR = 'STOP_REQUIRED_ERROR',

  /**
   * The submitted strike level is invalid
   */
  STRIKE_LEVEL_TOLERANCE = 'STRIKE_LEVEL_TOLERANCE',

  /**
   * The operation completed successfully
   */
  SUCCESS = 'SUCCESS',

  /**
   * The market or the account do not allow for trailing stops
   */
  TRAILING_STOP_NOT_ALLOWED = 'TRAILING_STOP_NOT_ALLOWED',

  /**
   * The operation resulted in an unknown result condition. Check transaction history or contact support for further information
   */
  UNKNOWN = 'UNKNOWN',

  /**
   * The requested operation has been attempted on the wrong direction
   */
  WRONG_SIDE_OF_MARKET = 'WRONG_SIDE_OF_MARKET'
}

/**
 * Position status
 */
export enum PositionStatus {
  /**
   * Amended
   */
  AMENDED = 'AMENDED',

  /**
   * Closed
   */
  CLOSED = 'CLOSED',

  /**
   * Deleted
   */
  DELETED = 'DELETED',

  /**
   * Open
   */
  OPEN = 'OPEN',

  /**
   * Partially Closed
   */
  PARTIALLY_CLOSED = 'PARTIALLY_CLOSED',
}

export interface DealConfirmation {
  /**
   * Affected deals
   */
  affectedDeals: AffectedDeal[];

  /**
   * Transaction date
   */
  date: string;

  /**
   * Deal identifier
   */
  dealId: string;

  /**
   * Deal reference
   */
  dealReference: string;

  /**
   * Deal status
   */
  dealStatus: DealStatus;

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
   * True if guaranteed stop
   */
  guaranteedStop: boolean;

  /**
   * Level
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
   * Profit
   */
  profit: number;

  /**
   * Profit currency
   */
  profitCurrency: string;

  /**
   * Describes the error (or success) condition for the specified trading operation
   */
  reason: ConfirmReason;

  /**
   * Size
   */
  size: number;

  /**
   * Position status
   */
  status: PositionStatus;

  /**
   * Stop distance
   */
  stopDistance: number;

  /**
   * Stop level
   */
  stopLevel: number;

  /**
   * True if trailing stop
   */
  trailingStop: boolean;
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
  async confirm(dealReference: string): Promise<DealConfirmation> {
    return await this.request('put', `confirms/${dealReference}`, null, '1');
  }
}

// used in subscriptions

/**
 * Position status
 */
export enum UpdatePositionStatus {
  /**
   * Open
   */
  OPEN = 'OPEN',

  /**
   * Updated
   */
  UPDATED = 'UPDATED',

  /**
   * Deleted
   */
  DELETED = 'DELETED',
}

/**
 * Open position updates for an account
 */
export interface OpenPositionUpdate {
  /**
   * Deal direction
   */
  direction: DealDirection;

  /**
   * Limit level
   */
  limitLevel: number;	
  
  /**
   * Deal identifier
   */
  dealId: string;
  
  /**
   * Deal identifier of the originating deal
   */
  dealIdOrigin: string;
  /**
   * Stop level
   */
  stopLevel: number;
  
  /**
   * Instrument expiry
   */
  expiry: string;

  /**
   * Event date and time
   */
  timestamp: string;	

  /**
   * Trade size
   */
  size: number;
  
  /**
   * Position status
   */
  status: UpdatePositionStatus;
  
  /**
   * Instrument EPIC identifier
   */
  epic: string;
  /**
   * Trade level
   */
  level: number;
  
  /**
   * True if a guaranteed stop is in place
   */
  guaranteedStop: boolean;
  
  /**
   * Deal reference
   */
  dealReference: string;

  /**
   * Deal status
   */
  dealStatus: DealStatus;
  
  /**
   * User channel (do not bind to this value - it will be converted to a constant enum)
   */
  channel: string;
  
  /**
   * Currency
   */
  currency: string;

  /**
   * Trailing stop distance
   */
  trailingStopDistance: number;
  
  /**
   * Trailing stop increment
   */
  trailingStep: number;
}
