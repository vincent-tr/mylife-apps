'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import tabStyles from '../base/tab-styles';

import GroupNodeContainer from '../../containers/management/group-node-container';

const styles = {
  tree: {
    height : 'calc(100% - 90px)',
  }
};

const GroupTree = ({ groups }) => (
  <mui.List style={Object.assign({}, styles.tree, tabStyles.scrollable)}>
    {groups.map((group) => (<GroupNodeContainer key={group.id} group={group} level={0} />))}
  </mui.List>
);

GroupTree.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default GroupTree;
