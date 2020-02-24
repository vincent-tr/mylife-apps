// from https://github.com/schopenhauer/ig-markets/blob/master/lib/ig.js

import fetch, { Response } from 'node-fetch';
import IgError from './ig-error';

const REAL_API = 'https://api.ig.com/gateway/deal/';
const DEMO_API = 'https://demo-api.ig.com/gateway/deal/';

export default class IgConnection {
  private readonly api: string;
  private token: string = null;
  private cst: string = null;

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
    const data = await response.json();
    const { status, headers } = response;
    if(status >= 400 && status < 600) {
      throw new IgError(status, data.errorCode);
    }

    if(!this.token || !this.cst) {
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
  async login() {
    const credentials = {
      identifier: this.identifier,
      password: this.password
    };

    const data = await this.request('post', 'session', credentials);
    console.log(data);
  }

  /**
   * Log out of the current session
   */
  async logout() {
    await this.request('delete', 'session', null, '1');
  }
}
