'use strict';

import { React, mui, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { showDetail } from '../actions';
import { isShowDetail } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      isShowDetail: isShowDetail(state)
    })),
    ...useMemo(() => ({
      showDetail: (show) => dispatch(showDetail(show)),
    }), [dispatch])
  };
};

const AdditionalHeader = () => {
  const { isShowDetail, showDetail } = useConnect();
  return (
    <mui.IconButton color='inherit' onClick={() => showDetail(!isShowDetail)}>
      <icons.actions.Detail />
    </mui.IconButton>
  );
}

export default AdditionalHeader;
