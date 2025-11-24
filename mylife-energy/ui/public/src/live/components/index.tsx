import React from 'react';
import { useLifecycle, useActions } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import MainAnimation from './main-animation';
import NodeTable from './node-table';
import { styled } from '@mui/material';

const Container = styled('div')({
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

const Live: React.FC = () => {
  useViewLifecycle();

  return (
    <Container>
      <MainAnimation />
      <NodeTable />
    </Container>
  );
};

export default Live;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}
