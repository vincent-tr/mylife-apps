import { styled } from '@mui/material/styles';
import { PropsWithChildren } from 'react';

const Container = styled('div')({
  overflowY: 'auto',
});

const Wrapper = styled('div')({
  height: 0,
});

export interface ListContainerProps extends PropsWithChildren {
  className?: string;
}

// Taken from AutoSizer. Why do we need that ?!
export default function ListContainer({ className, children }: ListContainerProps) {
  return (
    <Container className={className}>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
}
