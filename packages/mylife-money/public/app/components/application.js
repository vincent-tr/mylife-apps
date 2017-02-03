'use strict';

import React from 'react';

import base from './base/index';
import MainTabs from './main-tabs';
import DialogErrorContainer from '../containers/dialog-error-container';

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
      <base.Theme>
        <div style={styles.root}>
          <MainTabs activeTab={this.state.tab} onTabChanged={(value) => this.setState({ tab: value })} />
          <DialogErrorContainer />
        </div>
      </base.Theme>
    );
  }
}

export default Application;
