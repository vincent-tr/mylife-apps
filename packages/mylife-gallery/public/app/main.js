'use strict';

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import store from './services/store-factory';

import { init } from './actions/user';

import Application from './components/application';

store.dispatch(init());

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);
