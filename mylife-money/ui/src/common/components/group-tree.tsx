import List from '@mui/material/List';
import { useMemo } from 'react';
import { makeGetSortedChildren } from '../../reference/selectors';
import { useAppSelector } from '../../store';
import GroupNode from './group-node';

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
  return useAppSelector((state: FIXME_any) => ({
    groups: getSortedChildren(state, 'root'),
  }));
}
