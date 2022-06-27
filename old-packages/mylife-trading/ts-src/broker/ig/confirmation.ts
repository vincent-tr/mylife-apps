import { ConfirmReason, DealConfirmation } from './api/dealing';
import { Connection } from './connection';
import { StreamSubscription } from './api/stream';

export class ConfirmationListener {
  private readonly listener: (data: any) => void = (data) => this.onUpdate(data);
  // before call wait, we keep all confirmations
  private readonly previousConfirmations = new Map<string, DealConfirmation>();
  private onConfirmation: (confirmation: DealConfirmation) => void;

  static fromConnection(connection: Connection) : ConfirmationListener {
    const subscription = connection.refTradeSubscription();
    return new ConfirmationListener(connection, subscription);
  }

  static fromSubscription(subscription: StreamSubscription) : ConfirmationListener {
    return new ConfirmationListener(null, subscription);
  }

  private constructor(private readonly connection: Connection, private readonly subscription: StreamSubscription) {
    this.subscription.on('update', this.listener);

    // will be overriden when waiting
    this.onConfirmation = (confirmation: DealConfirmation) => this.previousConfirmations.set(confirmation.dealReference, confirmation);
  }

  private onUpdate(data: any) {
    const confirmation = data.CONFIRMS as DealConfirmation;
    if (!confirmation) {
      return;
    }

    this.onConfirmation(confirmation);
  }

  private cleanup() {
    this.subscription.removeListener('update', this.listener);
    // if we created the subscription
    if(this.connection) {
      this.connection.unrefTradeSubscription();
    }
  }

  async wait(dealReference: string, timeout = 3000) {
    // did we get it already?
    const previous = this.previousConfirmations.get(dealReference);
    if (previous) {
      this.cleanup();
      return previous;
    }

    // wait for it
    return new Promise<DealConfirmation>((resolve, reject) => {
      const onTimeout = () => {
        this.cleanup();
        reject(new Error('Timeout while waiting for confirmation'));
      };

      const timer = setTimeout(onTimeout, timeout);

      this.onConfirmation = (confirmation: DealConfirmation) => {
        if (confirmation.dealReference !== dealReference) {
          return;
        }

        clearTimeout(timer);
        this.cleanup();
        resolve(confirmation);
      };
    });
  }
}

export class ConfirmationError extends Error {
  readonly description: string;

  constructor(readonly reasonCode: ConfirmReason) {
    super();

    this.description = reasons.get(this.reasonCode);
    this.message = `Position confirmation error (${this.reasonCode}): ${this.description}`;
  }
}

const reasons = new Map<ConfirmReason, string>();
reasons.set(ConfirmReason.ACCOUNT_NOT_ENABLED_TO_TRADING, 'The account is not enabled to trade');
reasons.set(ConfirmReason.ATTACHED_ORDER_LEVEL_ERROR, 'The level of the attached stop or limit is not valid');
reasons.set(ConfirmReason.ATTACHED_ORDER_TRAILING_STOP_ERROR, 'The trailing stop value is invalid');
reasons.set(ConfirmReason.CANNOT_CHANGE_STOP_TYPE, 'Cannot change the stop type.');
reasons.set(ConfirmReason.CANNOT_REMOVE_STOP, 'Cannot remove the stop.');
reasons.set(ConfirmReason.CLOSING_ONLY_TRADES_ACCEPTED_ON_THIS_MARKET, 'We are not taking opening deals on a Controlled Risk basis on this market');
reasons.set(ConfirmReason.CONFLICTING_ORDER, 'Resubmitted request does not match the original order.');
reasons.set(ConfirmReason.CONTACT_SUPPORT_INSTRUMENT_ERROR, 'Instrument has an error - check the order\'s currency is the instrument\'s currency (see the market\'s details) otherwise please contact support.');
reasons.set(ConfirmReason.CR_SPACING, 'Sorry we are unable to process this order. The stop or limit level you have requested is not a valid trading level in the underlying market.');
reasons.set(ConfirmReason.DUPLICATE_ORDER_ERROR, 'The order has been rejected as it is a duplicate of a previously issued order');
reasons.set(ConfirmReason.EXCHANGE_MANUAL_OVERRIDE, 'Exchange check failed. Please call in for assistance.');
reasons.set(ConfirmReason.EXPIRY_LESS_THAN_SPRINT_MARKET_MIN_EXPIRY, 'Order expiry is less than the sprint market\'s minimum expiry. Check the sprint market\'s market details for the allowable expiries.');
reasons.set(ConfirmReason.FINANCE_REPEAT_DEALING, 'The total size of deals placed on this market in a short period has exceeded our limits. Please wait before attempting to open further positions on this market.');
reasons.set(ConfirmReason.FORCE_OPEN_ON_SAME_MARKET_DIFFERENT_CURRENCY, 'Ability to force open in different currencies on same market not allowed');
reasons.set(ConfirmReason.GENERAL_ERROR, 'an error has occurred but no detailed information is available. Check transaction history or contact support for further information');
reasons.set(ConfirmReason.GOOD_TILL_DATE_IN_THE_PAST, 'The working order has been set to expire on a past date');
reasons.set(ConfirmReason.INSTRUMENT_NOT_FOUND, 'The requested market was not found');
reasons.set(ConfirmReason.INSUFFICIENT_FUNDS, 'The account has not enough funds available for the requested trade');
reasons.set(ConfirmReason.LEVEL_TOLERANCE_ERROR, 'The market level has moved and has been rejected');
reasons.set(ConfirmReason.LIMIT_ORDER_WRONG_SIDE_OF_MARKET, 'The deal has been rejected because the limit level is inconsistent with current market price given the direction.');
reasons.set(ConfirmReason.MANUAL_ORDER_TIMEOUT, 'The manual order timeout limit has been reached');
reasons.set(ConfirmReason.MARGIN_ERROR, 'Order declined during margin checks Check available funds.');
reasons.set(ConfirmReason.MARKET_CLOSED, 'The market is currently closed');
reasons.set(ConfirmReason.MARKET_CLOSED_WITH_EDITS, 'The market is currently closed with edits');
reasons.set(ConfirmReason.MARKET_CLOSING, 'The epic is due to expire shortly, client should deal in the next available contract.');
reasons.set(ConfirmReason.MARKET_NOT_BORROWABLE, 'The market does not allow opening shorting positions');
reasons.set(ConfirmReason.MARKET_OFFLINE, 'The market is currently offline');
reasons.set(ConfirmReason.MARKET_ORDERS_NOT_ALLOWED_ON_INSTRUMENT, 'The epic does not support \'Market\' order type');
reasons.set(ConfirmReason.MARKET_PHONE_ONLY, 'The market can only be traded over the phone');
reasons.set(ConfirmReason.MARKET_ROLLED, 'The market has been rolled to the next period');
reasons.set(ConfirmReason.MARKET_UNAVAILABLE_TO_CLIENT, 'The requested market is not allowed to this account');
reasons.set(ConfirmReason.MAX_AUTO_SIZE_EXCEEDED, 'The order size exceeds the instrument\'s maximum configured value for auto-hedging the exposure of a deal');
reasons.set(ConfirmReason.MINIMUM_ORDER_SIZE_ERROR, 'The order size is too small');
reasons.set(ConfirmReason.MOVE_AWAY_ONLY_LIMIT, 'The limit level you have requested is closer to the market level than the existing stop. When the market is closed you can only move the limit order further away from the current market level.');
reasons.set(ConfirmReason.MOVE_AWAY_ONLY_STOP, 'The stop level you have requested is closer to the market level than the existing stop level. When the market is closed you can only move the stop level further away from the current market level');
reasons.set(ConfirmReason.MOVE_AWAY_ONLY_TRIGGER_LEVEL, 'The order level you have requested is moving closer to the market level than the exisiting order level. When the market is closed you can only move the order further away from the current market level.');
reasons.set(ConfirmReason.OPPOSING_DIRECTION_ORDERS_NOT_ALLOWED, 'Opening CR position in opposite direction to existing CR position not allowed.');
reasons.set(ConfirmReason.OPPOSING_POSITIONS_NOT_ALLOWED, 'The deal has been rejected to avoid having long and short open positions on the same market or having long and short open positions and working orders on the same epic');
reasons.set(ConfirmReason.ORDER_DECLINED, 'Order declined; please contact Support');
reasons.set(ConfirmReason.ORDER_LOCKED, 'The order is locked and cannot be edited by the user');
reasons.set(ConfirmReason.ORDER_NOT_FOUND, 'The order has not been found');
reasons.set(ConfirmReason.OVER_NORMAL_MARKET_SIZE, 'The total position size at this stop level is greater than the size allowed on this market. Please reduce the size of the order.');
reasons.set(ConfirmReason.PARTIALY_CLOSED_POSITION_NOT_DELETED, 'Position cannot be deleted as it has been partially closed.');
reasons.set(ConfirmReason.POSITION_ALREADY_EXISTS_IN_OPPOSITE_DIRECTION, 'The deal has been rejected because of an existing position. Either set the \'force open\' to be true or cancel opposing position');
reasons.set(ConfirmReason.POSITION_NOT_AVAILABLE_TO_CANCEL, 'Position cannot be cancelled. Check transaction history or contact support for further information.');
reasons.set(ConfirmReason.POSITION_NOT_AVAILABLE_TO_CLOSE, 'Cannot close this position. Either the position no longer exists, or the size available to close is less than the size specified.');
reasons.set(ConfirmReason.POSITION_NOT_FOUND, 'The position has not been found');
reasons.set(ConfirmReason.REJECT_CFD_ORDER_ON_SPREADBET_ACCOUNT, 'Invalid attempt to submit a CFD trade on a spreadbet account');
reasons.set(ConfirmReason.REJECT_SPREADBET_ORDER_ON_CFD_ACCOUNT, 'Invalid attempt to submit a spreadbet trade on a CFD account');
reasons.set(ConfirmReason.SIZE_INCREMENT, 'Order size is not an increment of the value specified for the market.');
reasons.set(ConfirmReason.SPRINT_MARKET_EXPIRY_AFTER_MARKET_CLOSE, 'The expiry of the position would have fallen after the closing time of the market');
reasons.set(ConfirmReason.STOP_OR_LIMIT_NOT_ALLOWED, 'The market does not allow stop or limit attached orders');
reasons.set(ConfirmReason.STOP_REQUIRED_ERROR, 'The order requires a stop');
reasons.set(ConfirmReason.STRIKE_LEVEL_TOLERANCE, 'The submitted strike level is invalid');
reasons.set(ConfirmReason.SUCCESS, 'The operation completed successfully');
reasons.set(ConfirmReason.TRAILING_STOP_NOT_ALLOWED, 'The market or the account do not allow for trailing stops');
reasons.set(ConfirmReason.UNKNOWN, 'The operation resulted in an unknown result condition. Check transaction history or contact support for further information');
reasons.set(ConfirmReason.WRONG_SIDE_OF_MARKET, 'The requested operation has been attempted on the wrong direction');
