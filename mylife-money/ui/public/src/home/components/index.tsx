import React from 'react';
import Stats from './stats';
import ChartCount from './chart-count';
import ChartAmount from './chart-amount';
import { styled } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto'
});

const Home = () => {
  return (
    <Container>
      <Stats/>
      <ChartCount/>
      <ChartAmount/>
    </Container>
  );
};

export default Home;
