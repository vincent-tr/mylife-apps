'use strict';

import React from 'react';
import * as mui from 'material-ui';
import tabStyles from '../base/tab-styles';

import NodeContainer from '../../containers/groups/node-container';

const styles = {
  tree: {
    height : 'calc(100% - 90px)',
  }
};

const Tree = ({ groups }) => (
  <mui.List style={Object.assign({}, styles.tree, tabStyles.scrollable)}>
    {groups.map((group) => (<NodeContainer key={group.id} group={group} level={0} />))}
  </mui.List>
);

Tree.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Tree;
