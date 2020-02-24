export default class IgError extends Error {
  readonly description: string;

  constructor(readonly httpStatus: number, readonly errorCode: string) {
    super();

    this.description = getErrorDescription(this.httpStatus, this.errorCode);
    this.message = `${this.errorCode} (${this.httpStatus}): ${this.description}`;
  }
}

const descriptions = new Map<string, string>();
descriptions.set('endpoint.unavailable.for.api-key', 'The provided api key was not accepted');
descriptions.set('invalid.input', 'A generic input data error has occurred');
descriptions.set('invalid.url', 'Invalid URL');
descriptions.set('system.error', 'System error');

descriptions.set(
  'error.public-api.failure.encryption.required',
  'A login has been attempted to the login V1 service by a client from the IG Singapore company. They need to use the v2 version as they need to send their passwords encrypyted.'
);
descriptions.set('error.request.invalid.date-range', 'Invalid date range');
descriptions.set('error.security.api-key-missing', 'The api key was not provided');
descriptions.set('error.public-api.failure.kyc.required', 'The account is not allowed to log into public API. Please use the web platform.');
descriptions.set('error.public-api.failure.missing.credentials', 'The user has not provided all required security credentials.');
descriptions.set('error.public-api.failure.pending.agreements.required', 'The account is not allowed to log into public API. Please use the web platform.');
descriptions.set('error.public-api.failure.preferred.account.disabled', "The user's preferred account is disabled.");
descriptions.set('error.public-api.failure.preferred.account.not.set', 'The user has not set a preferred account.');
descriptions.set('error.security.account-token-invalid', 'The service requires an account token and the one provided was not valid');
descriptions.set('error.security.account-token-missing', 'The service requires an account token and it was not provided');
descriptions.set('error.security.client-token-invalid', 'The service requires a client token and the one provided was not valid');
descriptions.set('error.security.client-token-missing', 'The service requires a client token and it was not provided');
descriptions.set('error.security.oauth-token-invalid', 'Invalid OAuth access token');
descriptions.set('error.public-api.exceeded-account-allowance', 'The account traffic allowance has been exceeded');
descriptions.set('error.public-api.exceeded-account-historical-data-allowance', 'The account historical data traffic allowance has been exceeded');
descriptions.set('error.public-api.exceeded-account-trading-allowance', 'The account trading traffic allowance has been exceeded');
descriptions.set('error.public-api.exceeded-api-key-allowance', 'The api key traffic allowance has been exceeded');
descriptions.set('error.public-api.failure.stockbroking-not-supported', 'Stockbroking not supported for Public API users.');
descriptions.set('error.security.api-key-disabled', 'The provided api key was not accepted because it is not currently enabled');
descriptions.set('error.security.api-key-invalid', 'The provided api key was not accepted');
descriptions.set('error.security.api-key-restricted', 'The provided api key was not valid for the requesting account');
descriptions.set('error.security.api-key-revoked', 'The provided api key was not accepted because it has been revoked');

function getErrorDescription(httpStatus: number, errorCode: string) {
  if (!errorCode) {
    switch (httpStatus) {
      case 404:
        errorCode = 'invalid.url';
        break;
      case 500:
        errorCode = 'system.error';
        break;
    }
  }
  
  const description = descriptions.get(errorCode);
  return description || '<unknown error>';
}
