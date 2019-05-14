'use strict';

export const getAccounts = (state) => state.accounts.toArray();
export const getAccount  = (state, { account }) => state.accounts.get(account);
