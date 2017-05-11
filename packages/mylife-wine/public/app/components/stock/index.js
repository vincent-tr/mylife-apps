'use strict';

import React from 'react';
import base from '../base/index';

import StockLookupPanelContainer from '../../containers/common/stock-lookup-panel-container';
import ResultsContainer from '../../containers/stock/results-container';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  criteria: {
    flex: '0 0 320px',
    width: '100%'
  },
  results: {
    flex: 1,
    width: '100%'
  }
};

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      criteria: {
        type      : null,
        region    : null,
        name      : null,
        sparkling : null,
        dishes    : [],
      }
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <base.GroupBox style={styles.criteria} title={'Critères de filtre'}>
          <StockLookupPanelContainer criteria={this.state.criteria} onChange={values => this.setState({ criteria: { ... this.state.criteria, ... values } })}/>
        </base.GroupBox>
        <base.GroupBox style={styles.results} title={'Etat du stock'}>
          <ResultsContainer criteria={this.state.criteria}/>
        </base.GroupBox>
      </div>
    );
  }
}

export default Index;