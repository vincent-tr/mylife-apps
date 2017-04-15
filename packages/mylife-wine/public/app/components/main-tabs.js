'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from './base/index';
import icons from './icons';
import Reference from './reference/index';

const styles = {
  tabs: {
    height : '100%',
    position: 'relative',
    zIndex : -1, // need that for toolbar tooltips ?!
  },
  tabContainer: {
    height : 'calc(100% - 30px)',
  },
  tabLabelIcon: {
    float: 'left'
  },
  tabLabelText: {
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: '24px',
    marginLeft: '10px'
  }
};

function renderTabLabel(text, icon) {
  return(
    <div>
      <div style={styles.tabLabelIcon}>{icon}</div>
      <div style={styles.tabLabelText}>{text}</div>
    </div>
  );
}

class MainTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tab: 'in' };
  }

  render() {
    return (
      <mui.Tabs value={this.state.tab}
                onChange={(value) => this.setState({ tab: value })}
                style={styles.tabs}
                contentContainerStyle={styles.tabContainer}
                tabTemplate={base.TabTemplate}>
        <mui.Tab value="in"
                 label={renderTabLabel('Entree', (<icons.tabs.Management />))}>
          <span>Entree</span>
        </mui.Tab>
        <mui.Tab value="out"
                 label={renderTabLabel('Sortie', (<icons.tabs.Management />))}>
          <span>Sortie</span>
        </mui.Tab>
        <mui.Tab value="stock"
                 label={renderTabLabel('Stock', (<icons.tabs.Management />))}>
          <span>Stock</span>
        </mui.Tab>
        <mui.Tab value="history"
                 label={renderTabLabel('Historique', (<icons.tabs.Management />))}>
          <span>Historique</span>
        </mui.Tab>
        <mui.Tab value="reference"
                 label={renderTabLabel('Donnees de reference', (<icons.tabs.Management />))}>
          <Reference/>
        </mui.Tab>
      </mui.Tabs>
    );
  }
}

export default MainTabs;
