'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { colors, createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import StoreProvider from './store-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';
//import { LayoutRouter } from '../../modules/routing/components';
import { Layout } from '../layout';

const defaultThemeConfig = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
};

const Application = ({
  routes,
  theme = createMuiTheme(defaultThemeConfig),
  ...props
} = {}) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>
);

Application.propTypes = {
  routes: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  theme: PropTypes.object
};

export default Application;
