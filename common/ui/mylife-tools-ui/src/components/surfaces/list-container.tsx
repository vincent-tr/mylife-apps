import React, { PropsWithChildren } from 'react';
import { styled } from '@mui/material/styles';

const Container = styled('div')({
  overflowY: 'auto',
});

const Wrapper = styled('div')({
  height: 0,
});

// Taken from AutoSizer. Why do we need that ?!
const ListContainer: React.FunctionComponent<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  return (
    <Container className={className}>
      <Wrapper>
        {children}
      </Wrapper>
    </Container>
  );
};

export default ListContainer;