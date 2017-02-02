'use strict';

import React from 'react';
import * as mui from 'material-ui';

import NodeContainer from '../../containers/groups/node-container';

const Tree = ({ groups }) => (
  <mui.List>
    {groups.map((group) => (<NodeContainer key={group.id} group={group} />))}
  </mui.List>
);

Tree.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Tree;
