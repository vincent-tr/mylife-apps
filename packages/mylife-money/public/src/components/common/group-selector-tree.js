'use strict';

import { React, PropTypes, mui, createUseConnect } from 'mylife-tools-ui';
import tabStyles from '../base/tab-styles';
import { makeGetSortedChildren } from '../../selectors/groups';

const useConnect = createUseConnect(
  () => {
    const getSortedChildren = makeGetSortedChildren();
    return (state) => ({
      groups : getSortedChildren(state, {})
    });
  }
);

const GroupSelectorTree = ({ onSelect }) => {
  const groups = useConnect();
  return (
    <mui.List style={tabStyles.scrollable}>
      {groups.map((group) => (<GroupSelectorTree key={group.id} group={group} level={0} onSelect={onSelect} />))}
    </mui.List>

  );
};

GroupSelectorTree.propTypes = {
  onSelect : PropTypes.func.isRequired
};

export default GroupSelectorTree;
