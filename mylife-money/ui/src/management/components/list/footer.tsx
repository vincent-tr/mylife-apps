import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useScreenPhone } from 'mylife-tools';
import { useAppSelector } from '../../../store-api';
import { getOperationSummaries } from '../../store';
import * as colors from './colors';

interface TotalProps {
  dense: boolean;
  type: 'debit' | 'credit' | 'total';
}

const Total = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'dense' && prop !== 'type',
})<TotalProps>(({ theme, dense, type }) => {
  const base = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: colors[type],
  };

  return dense
    ? {
        ...base,
        width: 80,
        marginLeft: theme.spacing(1),
        paddingLeft: theme.spacing(1),
      }
    : {
        ...base,
        width: 100,
        marginLeft: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      };
});

interface TotalOpsProps {
  dense: boolean;
}

const TotalOps = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<TotalOpsProps>(({ theme, dense }) => {
  const base = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  };

  return dense
    ? {
        ...base,
        width: 80,
        marginLeft: theme.spacing(1),
      }
    : {
        ...base,
        marginLeft: theme.spacing(2),
      };
});

export type FooterProps = Omit<React.ComponentProps<typeof Toolbar>, 'children'>;

export default function Footer(props: FooterProps) {
  const isPhone = useScreenPhone();
  const { count, totalDebit, totalCredit, total } = useAppSelector(getOperationSummaries);

  return (
    <Toolbar {...props}>
      <Typography>Total</Typography>
      <Total dense={isPhone} type="debit">
        {totalDebit}
      </Total>
      <Total dense={isPhone} type="credit">
        {totalCredit}
      </Total>
      <Total dense={isPhone} type="total">
        {total}
      </Total>
      <TotalOps dense={isPhone}>{count} opérations</TotalOps>
    </Toolbar>
  );
}
