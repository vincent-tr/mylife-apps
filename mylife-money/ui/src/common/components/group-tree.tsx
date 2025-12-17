import List from '@mui/material/List';
import { useMemo } from 'react';
import { makeGetSortedChildren } from '../../reference/selectors';
import { useAppSelector } from '../../store-api';
import GroupNode from './group-node';

interface GroupTreeProps {
  height?: number;
  onSelect: (id: string) => void;
  selectedGroupId: string | null;
  disabledGroupIds?: string[];
}

const GroupTree = ({ onSelect, selectedGroupId, disabledGroupIds, ...props }: GroupTreeProps) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  const groups = useAppSelector((state) => getSortedChildren(state, 'root'));

  return (
    <List component="div" {...props}>
      {groups.map((group) => (
        <GroupNode key={group._id} group={group} level={0} onSelect={onSelect} selectedGroupId={selectedGroupId} disabledGroupIds={disabledGroupIds} parentDisabled={false} />
      ))}
    </List>
  );
};

export default GroupTree;
