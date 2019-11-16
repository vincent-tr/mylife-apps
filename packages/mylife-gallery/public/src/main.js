'use strict';

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import  './services/store-factory';

import Application from './components/application';

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);

// TODO: remove npm i -D connected-react-router react-router-dom redux-thunk
