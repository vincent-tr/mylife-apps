'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Application from './components/application';

import { getCapacities, getDishes, getRegions, getTypes } from './actions/references';
import { getArticles } from './actions/articles';
import { refreshStock } from './actions/stock';
import store from './services/store-factory';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

store.dispatch(getCapacities());
store.dispatch(getDishes());
store.dispatch(getRegions());
store.dispatch(getTypes());
store.dispatch(getArticles());
store.dispatch(refreshStock());

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);