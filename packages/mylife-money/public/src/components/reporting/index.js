'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

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

  tabChange(tab) {
    const { onResetOperations } = this.props;
    this.setState({ tab });
    onResetOperations();
  }

  render() {
    const { groups, groupBags, groupStacks, operations, onRefreshOperations } = this.props;
    return (
      <div style={styles.div}>
        <mui.Paper style={Object.assign({}, styles.paperSelector, tabStyles.scrollable, tabStyles.fullHeight)}>
          <ReportSelector value={this.state.tab} onChange={tab => this.tabChange(tab)} />
        </mui.Paper>
        <mui.Paper style={Object.assign({}, styles.paperDetails, tabStyles.scrollable, tabStyles.fullHeight)}>
          <Details groups={groups} groupBags={groupBags} groupStacks={groupStacks} operations={operations} onRefreshOperations={onRefreshOperations} value={this.state.tab} />
        </mui.Paper>
      </div>
    );
  }
}

Reporting.propTypes = {
  groups              : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  groupBags           : PropTypes.object.isRequired,
  groupStacks         : PropTypes.object.isRequired,
  operations          : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onRefreshOperations : PropTypes.func.isRequired,
  onResetOperations   : PropTypes.func.isRequired,
};

export default Reporting;