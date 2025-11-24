import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListContainer } from 'mylife-tools-ui';
import GroupTree from '../../../common/components/group-tree';
import { getSelectedGroupId, selectGroup } from '../../store';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state) => ({
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
