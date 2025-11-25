import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeGetSortedChildren } from '../../reference/selectors';
import GroupNode from './group-node';
import List from '@mui/material/List';

type FIXME_any = any;

interface GroupTreeProps {
  height?: number;
  onSelect: (id: string) => void;
  selectedGroupId: string | null;
  disabledGroupIds?: string[];
}

const GroupTree = ({ onSelect, selectedGroupId, disabledGroupIds, ...props }: GroupTreeProps) => {
  const { groups } = useConnect();
  return (
    <List component="div" {...props}>
      {groups.map((group) => (
        <GroupNode key={group._id} group={group} level={0} onSelect={onSelect} selectedGroupId={selectedGroupId} disabledGroupIds={disabledGroupIds} parentDisabled={false} />
      ))}
    </List>
  );
};

export default GroupTree;

function useConnect() {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector((state: FIXME_any) => ({
    groups: getSortedChildren(state, 'root'),
  }));
}
