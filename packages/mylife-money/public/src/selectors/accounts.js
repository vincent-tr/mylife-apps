'use strict';

import { io } from 'mylife-tools-ui';

const getAccountViewId = state => state.accounts;

export const getAccounts = (state) => io.getViewList(state, getAccountViewId(state));
export const getAccount  = (state, { account }) => io.getViewItem(state, getAccountViewId(state), account);
