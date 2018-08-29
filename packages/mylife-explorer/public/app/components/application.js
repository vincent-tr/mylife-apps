'use strict';

import React                    from 'react';
import StoreProvider            from './base/store-provider';
import DialogError              from './base/dialog-error';
import DialogBusy               from './base/dialog-busy';
import { BrowserRouter, Route } from 'react-router-dom';
import RouteWrapper             from './route-wrapper';

const Application = () => (
  <StoreProvider>
    <React.Fragment>
      <DialogError />
      <DialogBusy />
      <BrowserRouter>
        <Route component={RouteWrapper} />
      </BrowserRouter>
    </React.Fragment>
  </StoreProvider>
);

export default Application;
