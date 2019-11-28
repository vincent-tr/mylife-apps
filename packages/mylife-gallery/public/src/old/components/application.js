'use strict';

import React         from 'react';
import StoreProvider from './base/store-provider';
import Router        from './router';

const Application = () => (
  <StoreProvider>
    <Router />
  </StoreProvider>
);

export default Application;