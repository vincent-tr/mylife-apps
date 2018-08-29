'use strict';

import React         from 'react';
import StoreProvider from './base/store-provider';

const Application = () => (
  <StoreProvider>
    <div>Hello world!</div>
  </StoreProvider>
);

export default Application;