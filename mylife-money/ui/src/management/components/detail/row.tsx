import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

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

export interface RowProps extends PropsWithChildren {
  label?: string;
}

export default function Row({ label, children }: RowProps) {
  return (
    <Container>
      <Label>{label}</Label>

      <Content>{children}</Content>
    </Container>
  );
}
