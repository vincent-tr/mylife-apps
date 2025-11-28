import { styled } from '@mui/material/styles';
import ChartAmount from './chart-amount';
import ChartCount from './chart-count';
import Stats from './stats';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

export default function Home() {
  return (
    <Container>
      <Stats />
      <ChartCount />
      <ChartAmount />
    </Container>
  );
}
