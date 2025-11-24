import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%'
});

const Label = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1)
}));

const Children = styled('div')({
  flex: '1 1 auto'
});

interface CriteriaFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

const CriteriaField: React.FC<CriteriaFieldProps> = ({ label, children }) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Children>
        {children}
      </Children>
    </Container>
  );
};

export default CriteriaField;
