'use strict';

import React from 'react';
import StoreProvider from './store-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';
import { LayoutRouter } from '../../modules/routing/components';

const Application = ({ ...props }) => (
  <StoreProvider>
    <React.Fragment>
      <Dialogs />
      <LayoutRouter {...props} />
    </React.Fragment>
  </StoreProvider>
);

export default Application;
