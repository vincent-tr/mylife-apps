'use strict';

import React             from 'react';
import StoreProvider     from './base/store-provider';
import DialogError       from './base/dialog-error';
import DialogBusy        from './base/dialog-busy';
import { Router, Route } from 'react-router-dom';
import RouteWrapper      from './route-wrapper';
import history           from '../services/history-factory';

const Application = () => (
  <StoreProvider>
    <React.Fragment>
      <DialogError />
      <DialogBusy />
      <Router history={history}>
        <Route component={RouteWrapper} />
      </Router>
    </React.Fragment>
  </StoreProvider>
);

export default Application;
