'use strict';

import { React, useMemo, useSelector, useDispatch, ListContainer } from 'mylife-tools-ui';
import GroupTree from '../../../common/components/group-tree';
import { getSelectedGroupId } from '../../selectors';
import { selectGroup } from '../../actions';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      selectedGroupId : getSelectedGroupId(state),
    })),
    ...useMemo(() => ({
      onSelect : (id) => dispatch(selectGroup(id))
    }), [dispatch])
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
