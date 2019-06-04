'use strict';

import { React, useMemo, mui, useSelector } from 'mylife-tools-ui';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupNode from './group-node';

const useConnect = () => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector(state => ({
    groups : getSortedChildren(state, {})
  }));
};

const GroupTree = (props) => {
  const { groups } = useConnect();
  return (
    <mui.List component="div" {...props}>
      {groups.map((group) => (<GroupNode key={group.id} group={group} level={0} />))}
    </mui.List>
  );
};

export default GroupTree;
