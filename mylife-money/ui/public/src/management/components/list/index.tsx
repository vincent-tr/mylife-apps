import React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material';
import Header from './header';
import Footer from './footer';
import Table from './table';

const Container = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
});

const StyledTable = styled(Table)({
  flex: '1 1 auto',
});

interface ListContainerProps {
  className?: string;
}

const ListContainer: React.FC<ListContainerProps> = ({ className }) => {
  return (
    <Container className={className}>
      <Header />
      <StyledTable />
      <Divider />
      <Footer />
    </Container>
  );
};

export default ListContainer;
