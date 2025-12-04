import { useMemo } from 'react';
import { ListContainer } from 'mylife-tools';
import GroupTree from '../../../common/components/group-tree';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSelectedGroupId, selectGroup } from '../../store';

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => ({
      selectedGroupId: getSelectedGroupId(state),
    })),
    ...useMemo(
      () => ({
        onSelect: (id) => dispatch(selectGroup(id)),
      }),
      [dispatch]
    ),
  };
};

const Tree = (props) => {
  const { selectedGroupId, onSelect } = useConnect();
  return (
    <ListContainer {...props}>
      <GroupTree onSelect={onSelect} selectedGroupId={selectedGroupId} />
    </ListContainer>
  );
};

export default Tree;
