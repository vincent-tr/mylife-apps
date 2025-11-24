import React, { useMemo } from 'react';
import { styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useLifecycle, useScreenSize } from 'mylife-tools-ui';
import { managementEnter, managementLeave, isOperationDetail } from '../store';

import Tree from './tree';
import List from './list';
import Detail from './detail';

type FIXME_any = any;

const Container = styled('div')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'row',
});

const StyledList = styled(List)({
  flex: '1 1 auto',
});

const StyledDetail = styled(Detail)({
  flex: 5,
});

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    detail: useSelector(isOperationDetail),
    ...useMemo(
      () => ({
        enter: () => dispatch(managementEnter()),
        leave: () => dispatch(managementLeave()),
      }),
      [dispatch]
    ),
  };
};

const Management = () => {
  const screenSize = useScreenSize();
  const { enter, leave, detail } = useConnect();
  useLifecycle(enter, leave);

  const main = detail ? <StyledDetail /> : <StyledList />;

  const normalLayout = (
    <Container>
      <Tree />
      {main}
    </Container>
  );

  const smallLayout = <Container>{main}</Container>;

  switch (screenSize) {
    case 'phone':
      return smallLayout;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return normalLayout;
  }
};

export default Management;
