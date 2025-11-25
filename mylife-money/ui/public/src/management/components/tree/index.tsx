import React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material';
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
