'use strict';

import React from 'react';

import MuiUtilsProvider from './mui-utils-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';
import { LayoutRouter } from '../../modules/routing/components';

const Application = ({ theme, ...props }) => (
  <MuiUtilsProvider>
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <React.Fragment>
          <Dialogs />
          <LayoutRouter {...props} />
        </React.Fragment>
      </StoreProvider>
    </ThemeProvider>
  </MuiUtilsProvider>
);

Application.propTypes = {
  theme: ThemeProvider.propTypes.theme
};

export default Application;
