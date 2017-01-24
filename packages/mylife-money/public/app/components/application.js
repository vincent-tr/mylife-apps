'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';

import theme from './theme';
import MainTabs from './main-tabs';

const styles = {
  root: {
    position : 'fixed',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0,
    zoom     : '80%'
  }
};

class Application extends React.Component {

  constructor(props) {
    super(props);

    this.state = { tab: 'management' };
  }

  render() {
    return (
      <muiStyles.MuiThemeProvider muiTheme={theme}>
        <div style={styles.root}>
          <MainTabs activeTab={this.state.tab} onTabChanged={(value) => this.setState({ tab: value })} />
        </div>
      </muiStyles.MuiThemeProvider>
    );
  }
}

export default Application;
