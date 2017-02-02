'use strict';

import React from 'react';
import * as mui from 'material-ui';

import GroupNodeContainer from '../../containers/groups/node-container';

const GroupTree = ({ groups }) => (
  <mui.List>
    {groups.map((group) => (<GroupNodeContainer key={group.id} group={group} />))}
  </mui.List>
);

GroupTree.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default GroupTree;
