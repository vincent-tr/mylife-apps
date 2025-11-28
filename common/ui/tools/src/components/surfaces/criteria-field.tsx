import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { PropsWithChildren } from 'react';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
});

const Label = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const Children = styled('div')({
  flex: '1 1 auto',
});

interface CriteriaFieldProps extends PropsWithChildren {
  label: React.ReactNode;
}

export default function CriteriaField({ label, children }: CriteriaFieldProps) {
  return (
    <Container>
      <Label>{label}</Label>
      <Children>{children}</Children>
    </Container>
  );
}
