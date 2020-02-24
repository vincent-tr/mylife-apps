// https://labs.ig.com/rest-trading-api-reference

/**
 * Account financial data
 */
export interface AccountInfo {
  /**
   * Account funds available for trading amount
   */
  available: number;

  /**
   * Balance of funds in the account
   */
  balance: number;

  /**
   * Minimum deposit amount required for margins
   */
  deposit: number;

  /**
   * Account profit and loss amount
   */
  profitLoss: number;
}

/**
 * Account type
 */
export enum AccountType {
  /**
   * 	CFD account
   */
  CFD = 'CFD',

  /**
   * 	Physical account
   */
  PHYSICAL = 'PHYSICAL',

  /**
   * Spread bet account
   */
  SPREADBET = 'SPREADBET'
}

/**
 * Account details
 */
export interface Account {
  /**
   * Account identifier
   */
  accountId: string;

  /**
   * Account name
   */
  accountName: string;

  /**
   * Account type
   */
  accountType: AccountType;

  /**
   * Indicates whether this account is the client's preferred account
   */
  preferred: boolean;
}