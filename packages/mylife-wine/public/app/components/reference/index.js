'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';

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

class Reference extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tab: 'capacities' };
  }

  render() {
    return (
      <mui.Tabs value={this.state.tab}
                onChange={(value) => this.setState({ tab: value })}
                style={styles.tabs}
                contentContainerStyle={styles.tabContainer}
                tabTemplate={base.TabTemplate}>
        <mui.Tab value="capacities"
                 label={renderTabLabel('Capacites de bouteilles', (<icons.tabs.Management />))}>
          <span>capacities</span>
        </mui.Tab>
        <mui.Tab value="dishes"
                 label={renderTabLabel('Plats', (<icons.tabs.Management />))}>
          <span>dishes</span>
        </mui.Tab>
        <mui.Tab value="regions"
                 label={renderTabLabel('Regions', (<icons.tabs.Management />))}>
          <span>regions</span>
        </mui.Tab>
        <mui.Tab value="types"
                 label={renderTabLabel('Types', (<icons.tabs.Management />))}>
          <span>types</span>
        </mui.Tab>
      </mui.Tabs>
    );
  }
}

export default Reference;