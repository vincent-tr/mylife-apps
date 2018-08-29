'use strict';

import React                    from 'react';
import StoreProvider            from './base/store-provider';
import DialogError              from './base/dialog-error';
import { BrowserRouter, Route } from 'react-router-dom';

import { withRouter } from 'react-router';

// A simple component that shows the pathname of the current location
const ShowTheLocation = ({ match, location, history }) => (
  <div>You are now at {location.pathname}</div>
);

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);

const Application = () => (
  <StoreProvider>
    <React.Fragment>
      <DialogError />
      <BrowserRouter>
        <Route component={ShowTheLocationWithRouter} />
      </BrowserRouter>
    </React.Fragment>
  </StoreProvider>
);

export default Application;
