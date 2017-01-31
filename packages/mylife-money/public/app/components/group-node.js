'use strict';

import React from 'react';
import base from './base/index';

const GroupNode = ({ group, children }) => (
  <base.SelectableListItem
    value={{ id: group.id }}
    primaryText={group.display}
    nestedItems={children} />
);

GroupNode.propTypes = {
  group    : React.PropTypes.object.isRequired,
  children : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default GroupNode;
