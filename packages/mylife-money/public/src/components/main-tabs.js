'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import base from './base/index';
import icons from './icons';

import Management from './management/index';
import ReportingContainer from '../containers/reporting/index-container';

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
      <Management />
    </mui.Tab>
    <mui.Tab value="reporting"
             label={renderTabLabel('Reporting', (<icons.tabs.Reporting />))}>
      <ReportingContainer />
    </mui.Tab>
  </mui.Tabs>
);

MainTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChanged: PropTypes.func.isRequired
};

export default MainTabs;
