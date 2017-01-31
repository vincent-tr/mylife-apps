'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';
import icons from './icons';

import ManagementContainer from '../containers/management/index-container';
import Reporting from './reporting/index';

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

const MainTabs = ({ activeTab, onTabChanged }) => (
  <mui.Tabs value={activeTab}
            onChange={onTabChanged}
            style={styles.tabs}
            contentContainerStyle={styles.tabContainer}
            tabTemplate={base.TabTemplate}>
    <mui.Tab value="management"
             label={renderTabLabel('Management', (<icons.tabs.Management />))}>
      <ManagementContainer />
    </mui.Tab>
    <mui.Tab value="reporting"
             label={renderTabLabel('Reporting', (<icons.tabs.Reporting />))}>
      <Reporting />
    </mui.Tab>
  </mui.Tabs>
);

MainTabs.propTypes = {
  activeTab: React.PropTypes.string.isRequired,
  onTabChanged: React.PropTypes.func.isRequired
};

export default MainTabs;
