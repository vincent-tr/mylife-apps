import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div')({
  cursor: 'default',
});

export type StopPropagationContainerProps = React.HTMLAttributes<HTMLDivElement>;

const StopPropagationContainer: React.FC<StopPropagationContainerProps> = ({ className, ...props }) => {
  return <Container onClick={(event) => event.stopPropagation()} onFocus={(event) => event.stopPropagation()} className={className} {...props} />;
};

export default StopPropagationContainer;
