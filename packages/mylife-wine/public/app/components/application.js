'use strict';

import React from 'react';

import base from './base/index';
import MainTabs from './main-tabs';
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
  <base.Theme>
    <base.StoreProvider>
      <div style={styles.root}>
        <MainTabs />
        <DialogErrorContainer />
        <DialogInfoContainer />
      </div>
    </base.StoreProvider>
  </base.Theme>
);

export default Application;
