'use strict';

import { React, mui, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { showDetail } from '../actions';
import { getData, isShowDetail } from '../selectors';
import { getName, makeUrl } from './tools';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getData(state),
      isShowDetail: isShowDetail(state),
    })),
    ...useMemo(() => ({
      showDetail: (show) => dispatch(showDetail(show)),
    }), [dispatch])
  };
};

const AdditionalHeader = () => {
  const { data, isShowDetail, showDetail } = useConnect();
  const showDownload = data && data.type === 'File';
  return (
    <>
      {showDownload && (
        <mui.IconButton color='inherit' download={getName(data)} href={makeUrl(data)}>
          <icons.actions.Download />
        </mui.IconButton>
      )}

      <mui.IconButton color='inherit' onClick={() => showDetail(!isShowDetail)}>
        <icons.actions.Detail />
      </mui.IconButton>
    </>
  );
}

export default AdditionalHeader;
