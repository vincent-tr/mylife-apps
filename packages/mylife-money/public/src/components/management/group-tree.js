'use strict';

import { React, useMemo, mui, useSelector, AutoSizer } from 'mylife-tools-ui';
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
    <div {...props}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <mui.List component="div" height={height}>
            {groups.map((group) => (<GroupNode key={group.id} group={group} level={0} />))}
          </mui.List>
        )}
      </AutoSizer>
    </div>
  );
};

export default GroupTree;
