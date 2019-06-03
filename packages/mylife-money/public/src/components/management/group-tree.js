'use strict';

import { React, mui, createUseConnect } from 'mylife-tools-ui';
import tabStyles from '../base/tab-styles';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupNode from './group-node';

const useConnect = createUseConnect(
  () => {
    const getSortedChildren = makeGetSortedChildren();
    return (state) => ({
      groups : getSortedChildren(state, {})
    });
  }
);

const styles = {
  tree: {
    height : 'calc(100% - 90px)',
  }
};

const GroupTree = () => {
  const { groups } = useConnect();
  return (
    <mui.List style={Object.assign({}, styles.tree, tabStyles.scrollable)}>
      {groups.map((group) => (<GroupNode key={group.id} group={group} level={0} />))}
    </mui.List>
  );
};

export default GroupTree;
