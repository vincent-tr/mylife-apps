'use strict';

import React from 'react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

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

class Application extends React.Component {

  constructor(props) {
    super(props);

    this.state = { tab: 'management' };
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <base.Theme>
          <base.StoreProvider>
            <div style={styles.root}>
              <MainTabs activeTab={this.state.tab} onTabChanged={(value) => this.setState({ tab: value })} />
              <DialogErrorContainer />
              <DialogInfoContainer />
            </div>
          </base.StoreProvider>
        </base.Theme>
      </MuiPickersUtilsProvider>
    );
  }
}

export default Application;
