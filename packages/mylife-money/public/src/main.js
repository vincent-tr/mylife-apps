'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { getAccounts, getGroups } from './actions/common';
import { getOperations } from './actions/management';
import Application from './components/application';

import store from './services/store-factory';

import { services } from 'mylife-tools-ui';
import dataService from './services/data-service';
import reducer from './reducers/index';

services.initStore(reducer, dataService);

services.render({ routes: (
  <div />
)});

store.dispatch(getAccounts());
store.dispatch(getGroups());
store.dispatch(getOperations());
