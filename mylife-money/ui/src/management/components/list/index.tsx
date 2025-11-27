import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React from 'react';
import Footer from './footer';
import Header from './header';
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
