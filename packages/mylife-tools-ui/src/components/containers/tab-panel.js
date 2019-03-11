'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '../button';
import GroupBox from './group-box';

import './tab-panel.scss';

const Tab = ({ id, header, disabled, className, headerClassName, children }) => {
  void id, header, disabled, className, headerClassName, children; // read props directly
  return null;
};

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

const TabPanel = ({ stretch, current, onChange, className, headerClassName, children }) => {
  const tabs = getTabs(children);
  const currentTab = tabs.find(tab => tab.id === current);
  if(!currentTab) {
    throw new Error(`No tab found with id '${current}'`);
  }

  return (
    <GroupBox stretch={stretch} containerClassName={classNames('tab-panel', className)} titleClassName={headerClassName} title={tabs.map(tab => (
      <Button key={tab.id} primary={currentTab === tab} disabled={tab.disabled} className={classNames('header-item', tab.headerClassName)} onClick={() => onChange(tab.id)}>
        {tab.header}
      </Button>
    ))} className={currentTab.className}>
      {currentTab.children}
    </GroupBox>
  );
};

TabPanel.propTypes = {
  stretch: PropTypes.bool,
  current: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export { TabPanel, Tab };

function getTabs(children) {
  return React.Children.map(children, tab => {
    if(tab.type !== Tab) {
      throw new Error('Only expect Tab children');
    }

    const { id, header, disabled, className, headerClassName, children } = tab.props;
    return { id, header, disabled, className, headerClassName, children };
  });
}
