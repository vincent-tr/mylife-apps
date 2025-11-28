import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div')({
  cursor: 'default',
});

export type StopPropagationContainerProps = React.HTMLAttributes<HTMLDivElement>;

export default function StopPropagationContainer(props: StopPropagationContainerProps) {
  return <Container onClick={(event) => event.stopPropagation()} onFocus={(event) => event.stopPropagation()} {...props} />;
}
