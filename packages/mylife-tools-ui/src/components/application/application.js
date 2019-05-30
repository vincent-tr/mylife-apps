'use strict';

import React from 'react';
import StoreProvider from './store-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';
//import { LayoutRouter } from '../../modules/routing/components';
import { Layout } from '../layout';

const Application = ({ routes, ...props }) => (
  <StoreProvider>
    <React.Fragment>
      <Dialogs />
      <Layout />
      {/*
      <LayoutRouter {...props}>
        {routes}
      </LayoutRouter>
      */}
    </React.Fragment>
  </StoreProvider>
);

export default Application;
