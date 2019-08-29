'use strict';

import { React, useMemo, useSelector, useDispatch, AutoSizer } from 'mylife-tools-ui';
import GroupTree from '../../../components/common/group-tree';
import { getSelectedGroupId } from '../../selectors';
import { selectGroup } from '../../actions';

const useConnect = () => {
  const dispatch = useDispatch();
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
    <div {...props}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <GroupTree height={height} onSelect={onSelect} selectedGroupId={selectedGroupId} />
        )}
      </AutoSizer>
    </div>
  );
};

export default Tree;
