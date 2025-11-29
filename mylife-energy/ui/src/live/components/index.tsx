import { styled } from '@mui/material/styles';
import { useLiveDevicesView, useLiveMeasuresView } from '../views';
import MainAnimation from './main-animation';
import NodeTable from './node-table';

const Container = styled('div')({
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

export default function Live() {
  useLiveDevicesView();
  useLiveMeasuresView();

  return (
    <Container>
      <MainAnimation />
      <NodeTable />
    </Container>
  );
}
