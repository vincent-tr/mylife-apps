'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import 'material-icons/iconfont/material-icons.css';

import { getAccounts, getGroups } from './actions/common';
import { getOperations } from './actions/management';
import Application from './components/application';

import store from './services/store-factory';

store.dispatch(getAccounts());
store.dispatch(getGroups());
store.dispatch(getOperations());

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);
