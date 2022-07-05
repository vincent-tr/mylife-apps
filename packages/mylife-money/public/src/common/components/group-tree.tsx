'use strict';

import { React, useMemo, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import { makeGetSortedChildren } from '../../reference/selectors';
import GroupNode from './group-node';

const useConnect = () => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector(state => ({
    groups : getSortedChildren(state, {})
  }));
};

const GroupTree = ({ onSelect, selectedGroupId, disabledGroupIds, ...props }) => {
  const { groups } = useConnect();
  return (
    <mui.List component='div' {...props}>
      {groups.map((group) => (
        <GroupNode key={group._id} group={group} level={0} onSelect={onSelect} selectedGroupId={selectedGroupId} disabledGroupIds={disabledGroupIds} />
      ))}
    </mui.List>
  );
};

GroupTree.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.string,
  disabledGroupIds: PropTypes.array,
};

export default GroupTree;
