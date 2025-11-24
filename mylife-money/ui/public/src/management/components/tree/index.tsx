import React from 'react';
import { styled, Paper, Divider } from '@mui/material';
import Tree from './tree';
import Toolbar from './toolbar';

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
