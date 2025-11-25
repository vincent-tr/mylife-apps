import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React from 'react';
import Toolbar from './toolbar';
import Tree from './tree';

const Container = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 500,
});

const StyledTree = styled(Tree)({
  overflowY: 'auto',
  flex: '1 1 auto',
});

interface TreeContainerProps {
  className?: string;
}

const TreeContainer: React.FC<TreeContainerProps> = ({ className }) => {
  return (
    <Container className={className}>
      <StyledTree />
      <Divider />
      <Toolbar />
    </Container>
  );
};

export default TreeContainer;
