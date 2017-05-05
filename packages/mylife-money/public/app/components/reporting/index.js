'use strict';

import React from 'react';
import * as mui from 'material-ui';

import ReportSelector from './report-selector';
import Details from './details';

import tabStyles from '../base/tab-styles';

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
    height: '100%'
  },
  paperSelector:{
    flex: '0 0 300px',
    height: '100%',
    textAlign: 'center',
  },
  paperDetails:{
    flex: 1,
    height: '100%',
    textAlign: 'center',
  }
};

class Reporting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: null
    };
  }

  render() {
    return (
      <div style={styles.div}>
        <mui.Paper style={Object.assign({}, styles.paperSelector, tabStyles.scrollable, tabStyles.fullHeight)}>
          <ReportSelector value={this.state.tab} onChange={tab => this.setState({ tab })} />
        </mui.Paper>
        <mui.Paper style={Object.assign({}, styles.paperDetails, tabStyles.scrollable, tabStyles.fullHeight)}>
          <Details value={this.state.tab} />
        </mui.Paper>
      </div>
    );
  }
}

export default Reporting;