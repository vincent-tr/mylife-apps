// https://labs.ig.com/rest-trading-api-reference

/**
 * Account financial data
 */
export interface AccountBalance {
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
export interface AccountSummary {
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

export enum AccountStatus {
  /**
   * Disabled
   */
  DISABLED = 'DISABLED',

  /**
   * Enabled
   */
  ENABLED = 'ENABLED',

  /**
   * Suspended from dealing
   */
  SUSPENDED_FROM_DEALING = 'SUSPENDED_FROM_DEALING'
}

/**
 * Account data
 */
export interface Account extends AccountSummary {
  /**
   * Account alias
   */
  accountAlias: string;

  /**
   * Account balances
   */
  balance: AccountBalance;

  /**
   * True if account can be transferred to
   */
  canTransferFrom: boolean;

  /**
   * True if account can be transferred from
   */
  canTransferTo: boolean;

  /**
   * Account currency
   */
  currency: string;

  /**
   * True if this the default login account
   */
  preferred: boolean;

  /**
   * Account status
   */
  status: AccountStatus;
}

export enum Environment {
  DEMO = 'DEMO',
  LIVE = 'LIVE',
  TEST = 'TEST',
  UAT = 'UAT'
}

export interface ClientAccountInformation {
  /**
   * Account financial data
   */
  accountInfo: AccountBalance;

  /**
   * Account type
   */
  accountType: AccountType;

  /**
   * Account details
   */
  accounts: AccountSummary[];

  /**
   * Client identifier
   */
  clientId: string;

  /**
   * Account currency
   */
  currencyIsoCode: string;

  /**
   * Account currency symbol
   */
  currencySymbol: string;

  /**
   * Active account identifier
   */
  currentAccountId: string;

  /**
   * Whether the account is enabled for placing trading orders
   */
  dealingEnabled: boolean;

  /**
   * Whether the Client has active demo accounts.
   */
  hasActiveDemoAccounts: boolean;

  /**
   * Whether the Client has active live accounts.
   */
  hasActiveLiveAccounts: boolean;

  /**
   * Lightstreamer endpoint for subscribing to account and price updates
   */
  lightstreamerEndpoint: string;

  /**
   * Describes the environment to be used as the rerouting destination
   */
  reroutingEnvironment: Environment;

  /**
   * Client account timezone offset relative to UTC, expressed in hours
   */
  timezoneOffset: number;

  /**
   * Whether the account is allowed to set trailing stops on his trades
   */
  trailingStopsEnabled: boolean;
}

/**
 * Paging metadata
 */
export interface PageMetadata {
  /**
   * Page number
   */
  pageNumber: number;

  /**
   * Page size
   */
  pageSize: number;

  /**
   * Total number of pages
   */
  totalPages: number;
}

/**
 * Paging metadata
 */
export interface PagingMetadata {
  /**
   * Paging metadata
   */
  pageData: PageMetadata;

  /**
   * Size
   */
  size: number;
}

/**
 * Transaction data
 */
export interface TransactionData {
  /**
   * True if this was a cash transaction
   */
  cashTransaction: boolean;

  /**
   * Level at which the order was closed
   */
  closeLevel: string;

  /**
   * Order currency
   */
  currency: string;

  /**
   * Local date
   */
  date: string;

  /**
   * Date
   */
  dateUtc: string;

  /**
   * Instrument name
   */
  instrumentName: string;

  /**
   * Position opened date
   */
  openDateUtc: string;

  /**
   * Level at which the order was opened
   */
  openLevel: string;

  /**
   * Period
   */
  period: string;

  /**
   * Profit and loss
   */
  profitAndLoss: string;

  /**
   * Reference
   */
  reference: string;

  /**
   * Formatted order size, including the direction (+ for buy, - for sell)
   */
  size: string;

  /**
   * Transaction type
   */
  transactionType: string;
}

/**
 * List of transactions
 */
export interface TransactionHistory {
  /**
   * Paging metadata
   */
  metadata: PagingMetadata;

  /**
   * Transaction data
   */
  transactions: TransactionData[];
}

export class AccountOperations {
  constructor(readonly request: (method: string, action: string, data?: any, version?: string) => Promise<any>) {
  }

  /**
   * Returns a list of accounts belonging to the logged-in client
   */
  async accounts(): Promise<Account[]> {
    return await this.request('get', 'accounts', null, '1');
  }

  // accounts/preferences

  /**
   * Returns the account activity history.
   */
  async accountHistory(): Promise<any> {
    return await this.request('get', 'history/activity', null, '3');
  }

  /**
   * Returns the transaction history. By default returns the minute prices within the last 10 minutes.
   */
  async  accountTransactions(): Promise<TransactionHistory> {
    return await this.request('get', 'history/transactions');
  }
}
