import { useMemo } from 'react';
import { ListContainer } from 'mylife-tools';
import GroupTree from '../../../common/components/group-tree';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSelectedGroupId, selectGroup } from '../../store';

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    selectedGroupId: useAppSelector(getSelectedGroupId),
    ...useMemo(
      () => ({
        onSelect: (groupId: string) => dispatch(selectGroup(groupId)),
      }),
      [dispatch]
    ),
  };
};

export type TreeProps = Omit<React.ComponentProps<typeof ListContainer>, 'children'>;

export default function Tree(props: TreeProps) {
  const { selectedGroupId, onSelect } = useConnect();
  return (
    <ListContainer {...props}>
      <GroupTree onSelect={onSelect} selectedGroupId={selectedGroupId} />
    </ListContainer>
  );
}
