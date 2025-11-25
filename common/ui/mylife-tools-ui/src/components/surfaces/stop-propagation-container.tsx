import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';

const Container = styled('div')({
  cursor: 'default',
});

const StopPropagationContainer = ({ className, ...props }) => {
  return <Container onClick={(event) => event.stopPropagation()} onFocus={(event) => event.stopPropagation()} className={className} {...props} />;
};

StopPropagationContainer.propTypes = {
  className: PropTypes.string,
};

export default StopPropagationContainer;
