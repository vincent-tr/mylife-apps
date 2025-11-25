import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

const Title = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const ToolbarFieldTitle = ({ ...props }) => {
  return <Title {...props} />;
};

export default ToolbarFieldTitle;
