'use strict';

import { React, useMemo, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import { makeGetSortedChildren } from '../../selectors/groups';

const useConnect = ({ group }) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector(state => ({
    children : getSortedChildren(state, { group })
  }));
};

const GroupSelectorNode = ({ level, group, onSelect }) => {
  const { children } = useConnect({ group });
  return (
    <mui.ListItem
      onClick={() => onSelect(group.id)}
      primaryText={<div style={{textAlign: 'left'}}>{group.display}</div>}
      leftIcon={<icons.Group />}
      nestedItems={children.map((child) => (<GroupSelectorNode key={child.id} group={child} level={level+1} onSelect={onSelect} />))}
      nestedLevel={level}
      initiallyOpen={true} />
  );
};

GroupSelectorNode.propTypes = {
  level    : PropTypes.number.isRequired,
  group    : PropTypes.object.isRequired,
  onSelect : PropTypes.func.isRequired
};

export default GroupSelectorNode;
