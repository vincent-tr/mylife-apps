// from https://github.com/schopenhauer/ig-markets/blob/master/lib/ig.js

import fetch, { Response } from 'node-fetch';
import { createLogger } from 'mylife-tools-server';
import IgError from './ig-error';
import Stream, { StreamSubscription } from './stream';
import { ClientAccountInformation } from './account';

const REAL_API = 'https://api.ig.com/gateway/deal/';
const DEMO_API = 'https://demo-api.ig.com/gateway/deal/';

const logger = createLogger('mylife:trading:broker:ig:connection');

/**
 * The encryption key to use in order to send the user password in an encrypted form
 */
export interface SessionEncryptionKey {
  /**
   * Encryption key in Base 64 format
   */
  encryptionKey: string;

  /**
   * Current timestamp in milliseconds since epoch
   */
  timeStamp: number;
}

export default class Connection {
  private readonly api: string;
  private token: string = null;
  private cst: string = null;
  private stream: Stream;
  private accountId: string;

  /**
   * Constructor
   *
   * @param key Your IG Markets account key.
   * @param identifier Your IG Markets username.
   * @param password Your IG Markets password.
   * @param isDemo Flag if this is demo account
   */
  constructor(private readonly key: string, private readonly identifier: string, private readonly password: string, isDemo: boolean) {
    if (!this.key || !this.identifier || !this.password) {
      throw new Error('key, identifier and password are required');
    }

    this.api = isDemo ? DEMO_API : REAL_API;
  }

  /**
   * Make a HTTP(S) request.
   *
   * @param method The HTTP method used.
   * @param action The action path appended to URL.
   * @param data The data passed to HTTP request.
   * @param version The version number passed to header.
   */
  async request(method: string, action: string, data: any = null, version: string = '2'): Promise<any> {
    const headers = this.getHeaders(version);
    const url = this.api + action;
    const body = data ? JSON.stringify(data) : null;

    const response = await fetch(url, { method, headers, body });
    return await this.processResponse(response);
  }


  private async processResponse(response: Response) {
    const data = await safeReadJson(response);
    const { status, headers } = response;
    if (status >= 400 && status < 600) {
      throw new IgError(status, data?.errorCode);
    }

    if (!this.token || !this.cst) {
      this.token = headers.get('X-SECURITY-TOKEN');
      this.cst = headers.get('CST');
    }

    return data;
  }

  /**
   * @param version
   * @returns {{Content-Type: string, Accept: string, Version: *, X-IG-API-KEY: (string|*), X-SECURITY-TOKEN: (null|*|string), CST: (*|null|string)}}
   */
  private getHeaders(version: string) {
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
      Version: version,
      'X-IG-API-KEY': this.key,
      'X-SECURITY-TOKEN': this.token || '',
      CST: this.cst || ''
    };
  }

  /**
   * Creates a trading session, obtaining session tokens for subsequent API access
   */
  async login(): Promise<ClientAccountInformation> {
    const credentials = {
      identifier: this.identifier,
      password: this.password
    };

    const data: ClientAccountInformation = await this.request('post', 'session', credentials);

    // TODO: should we pass account id as parameter ?
    const defaultAccount = data.accounts.find(acc => acc.preferred);
    this.accountId = defaultAccount.accountId;
    this.stream = new Stream(data.lightstreamerEndpoint, this.accountId, this.cst, this.token);

    logger.info(`Connection created: key='${this.key}', identifier='${this.identifier}', api=${this.api}`);

    return data;
  }

  /**
   * Log out of the current session
   */
  async logout(): Promise<void> {
    await this.request('delete', 'session', null, '1');

    this.token = null;
    this.cst = null;

    this.stream.terminate();
    this.stream = null;

    logger.info(`Connection closed: key='${this.key}', identifier='${this.identifier}', api=${this.api}`);
  }

  /**
   * Creates a trading session, obtaining session tokens for subsequent API access
   */
  async sessionEncryptionKey(): Promise<SessionEncryptionKey> {
    return await this.request('post', 'session/encryptionKey', null, '1');
  }

  accountIdentifier(): string {
    return this.accountId;
  }

  subscribe(subscriptionMode: string, items: string[], fields: string[]): StreamSubscription {
    return this.stream.createSubscription(subscriptionMode, items, fields);
  }
}

async function safeReadJson(response: Response) {
  try {
    return await response.json();
  }
  catch(err) {
    return null;
  }
}
