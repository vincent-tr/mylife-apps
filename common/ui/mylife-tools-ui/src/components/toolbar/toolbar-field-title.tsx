import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Title = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const ToolbarFieldTitle = ({ ...props }) => {
  return (
    <Title {...props} />
  );
};

export default ToolbarFieldTitle;
