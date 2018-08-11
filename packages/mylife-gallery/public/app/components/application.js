'use strict';

import React         from 'react';
import StoreProvider from './base/store-provider';
import DetailPopup   from './detail-popup';
import Grid          from './grid';

const Application = () => (
  <StoreProvider>
    <React.Fragment>
      <DetailPopup />
      <Grid />
    </React.Fragment>
  </StoreProvider>
);

export default Application;