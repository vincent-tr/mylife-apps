import { ListContainer } from 'mylife-tools';
import GroupTree from '../../../common/components/group-tree';
import { useAppSelector, useAppAction } from '../../../store-api';
import { getSelectedGroupId, selectGroup } from '../../store';

export type TreeProps = Omit<React.ComponentProps<typeof ListContainer>, 'children'>;

export default function Tree(props: TreeProps) {
  const selectedGroupId = useAppSelector(getSelectedGroupId);
  const onSelect = useAppAction(selectGroup);
  return (
    <ListContainer {...props}>
      <GroupTree onSelect={onSelect} selectedGroupId={selectedGroupId} />
    </ListContainer>
  );
}
