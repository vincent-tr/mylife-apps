'use strict';

export const getAccounts = (state) => state.accounts;
export const getAccount  = (state, { account }) => getAccounts(state).get(account);
