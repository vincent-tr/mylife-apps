'use strict';

import React from 'react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import base from './base/index';
import MainTabs from './main-tabs';
import Layout from './layout';
import DialogErrorContainer from '../containers/dialog-error-container';
import DialogInfoContainer from '../containers/dialog-info-container';

const styles = {
  root: {
    position : 'fixed',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0
  }
};

const Application = () => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <base.Theme>
      <base.StoreProvider>
        <div style={styles.root}>
          <Layout />
          {/* <MainTabs activeTab={this.state.tab} onTabChanged={(value) => this.setState({ tab: value })} /> */}
          <DialogErrorContainer />
          <DialogInfoContainer />
        </div>
      </base.StoreProvider>
    </base.Theme>
  </MuiPickersUtilsProvider>
);

export default Application;
