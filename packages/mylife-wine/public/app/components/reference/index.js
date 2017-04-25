'use strict';

import React from 'react';
import * as mui from 'material-ui';

import TypeList from './type-list';
import ItemListContainer from '../../containers/reference/item-list-container';

import tabStyles from '../base/tab-styles';

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
    height: '100%'
  },
  paperWhat:{
    flex: 2,
    height: '100%',
    textAlign: 'center',
  },
  paperList:{
    flex: 2,
    height: '100%',
    textAlign: 'center',
  },
  paperDetails:{
    flex: 4,
    height: '100%',
    textAlign: 'center',
  }
};

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'capacities',
      selected: null
    };
  }

  render() {
    return (
      <div style={styles.div}>
        <mui.Paper zDepth={1} style={Object.assign({}, styles.paperWhat, tabStyles.fullHeight)}>
          <div style={tabStyles.fullHeight}>
            <TypeList value={this.state.tab} onchange={tab => this.setState({ tab, selected: null })} />
          </div>
        </mui.Paper>
        <mui.Paper zDepth={1} style={Object.assign({}, styles.paperList, tabStyles.fullHeight)}>
          <div style={tabStyles.fullHeight}>
            <ItemListContainer type={this.state.tab} value={this.state.selected} onchange={selected => this.setState({ selected })} />
          </div>
        </mui.Paper>
        <mui.Paper zDepth={1} style={Object.assign({}, styles.paperDetails, tabStyles.fullHeight)}>
          <div style={tabStyles.fullHeight}>
            DETAILS
          </div>
        </mui.Paper>
      </div>
    );
  }
}

export default Index;