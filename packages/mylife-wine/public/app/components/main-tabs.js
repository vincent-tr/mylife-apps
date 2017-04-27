'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import In from './in/index';
import Out from './out/index';
import Stock from './stock/index';
import History from './history/index';
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
                 label={renderTabLabel('Entree', (<img src="images/misc/arrow-right-green-256.png" height="24" width="24" />))}>
          <In/>
        </mui.Tab>
        <mui.Tab value="out"
                 label={renderTabLabel('Sortie', (<img src="images/misc/arrow-left-red-256.png" height="24" width="24" />))}>
          <Out/>
        </mui.Tab>
        <mui.Tab value="stock"
                 label={renderTabLabel('Stock', (<img src="images/misc/inventory-48.png" height="24" width="24" />))}>
          <Stock/>
        </mui.Tab>
        <mui.Tab value="history"
                 label={renderTabLabel('Historique', (<img src="images/misc/history-32.png" height="24" width="24" />))}>
          <History/>
        </mui.Tab>
        <mui.Tab value="reference"
                 label={renderTabLabel('Donnees de reference', (<img src="images/misc/list-32.png" height="24" width="24" />))}>
          <Reference/>
        </mui.Tab>
      </mui.Tabs>
    );
  }
}

export default MainTabs;
