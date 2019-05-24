'use strict';

import React, { useState } from 'react';
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

const MainTabs = () => {
  const [activeTab, onTabChanged] = useState('management');
  return (
    <React.Fragment>
      <mui.Tabs value={activeTab} onChange={(e, value) => onTabChanged(value)}>
        <mui.Tab value="management" label={renderTabLabel('Management', (<icons.tabs.Management />))} />
        <mui.Tab value="reporting" label={renderTabLabel('Reporting', (<icons.tabs.Reporting />))} />
      </mui.Tabs>
      {activeTab === 'management' && <Management />}
      {activeTab === 'reporting' && <ReportingContainer />}
    </React.Fragment>
  );
};

export default MainTabs;
