'use strict';

import React from 'react';
import * as mui from 'material-ui';

import TypeList from './type-list';
import ItemListContainer from '../../containers/reference/item-list-container';
import DetailsContainer from '../../containers/reference/details-container';

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
        <mui.Paper style={Object.assign({}, styles.paperWhat, tabStyles.scrollable, tabStyles.fullHeight)}>
          <TypeList value={this.state.tab} onChange={tab => this.setState({ tab, selected: null })} />
        </mui.Paper>
        <mui.Paper style={Object.assign({}, styles.paperList, tabStyles.scrollable, tabStyles.fullHeight)}>
          <ItemListContainer type={this.state.tab} value={this.state.selected} onChange={selected => this.setState({ selected })} />
        </mui.Paper>
        <mui.Paper style={Object.assign({}, styles.paperDetails, tabStyles.scrollable, tabStyles.fullHeight)}>
          <DetailsContainer type={this.state.tab} value={this.state.selected} />
        </mui.Paper>
      </div>
    );
  }
}

export default Index;