'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { mui } from 'mylife-tools-ui';
import { makeGetSortedChildren } from '../../reference/selectors';
import GroupNode from './group-node';

type FIXME_any = any;

interface GroupTreeProps {
  height?: number;
  onSelect;
  selectedGroupId;
  disabledGroupIds?;
}

const GroupTree = ({ onSelect, selectedGroupId, disabledGroupIds, ...props }: GroupTreeProps) => {
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

function useConnect() {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector((state: FIXME_any) => ({
    groups : getSortedChildren(state, {} as FIXME_any)
  }));
}
