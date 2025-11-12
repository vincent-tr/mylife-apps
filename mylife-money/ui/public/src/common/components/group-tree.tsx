import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { makeGetSortedChildren } from '../../reference/selectors';
import GroupNode from './group-node';
import { List } from '@mui/material';

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
    <List component='div' {...props}>
      {groups.map((group) => (
        <GroupNode
          key={group._id}
          group={group}
          level={0}
          onSelect={onSelect}
          selectedGroupId={selectedGroupId}
          disabledGroupIds={disabledGroupIds}
          parentDisabled={false} />
      ))}
    </List>
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
