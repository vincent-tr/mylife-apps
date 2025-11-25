import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'baseline',
}));

const Label = styled(Typography)({
  width: 100,
});

const Content = styled('div')({
  flex: '1 1 auto',
});

const Row = ({ label, children }) => {
  return (
    <Container>
      <Label>{label}</Label>

      <Content>{children}</Content>
    </Container>
  );
};

Row.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Row;
