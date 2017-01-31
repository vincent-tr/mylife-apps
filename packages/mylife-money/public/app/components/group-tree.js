'use strict';

import React from 'react';
import base from './base/index';

import GroupNodeContainer from '../containers/group-node-container';

const GroupTree = ({ groups, selectedValueChanged, selectedNode }) => (
  <base.SelectableList
    selectedValueChanged={({ id }) => selectedValueChanged(id)}
    selectedNode={{id: selectedNode}}
  >
    {groups.map((group) => (<GroupNodeContainer key={group.id} group={group} />))}
  </base.SelectableList>
);

GroupTree.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  selectedValueChanged: React.PropTypes.func.isRequired,
  selectedNode: React.PropTypes.string
};

export default GroupTree;
