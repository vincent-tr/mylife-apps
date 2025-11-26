import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

const Separator = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  color: theme.palette.divider,
  borderRight: '0.1em solid currentColor',
}));

const ToolbarSeparator = () => {
  return <Separator>&nbsp;</Separator>;
};

export default ToolbarSeparator;
