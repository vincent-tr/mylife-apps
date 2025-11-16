import React from 'react';
import { styled, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import icons from '../../common/icons';
import { SuccessCell, WarningCell, ErrorCell } from '../../common/table-status';

const Container = styled(Paper)(({ theme }) => ({
  display: 'inline-block',
  width: 300,
  margin: theme.spacing(4),
}));

const HeaderCell = styled('div')(({ theme }) => ({
  display: 'flex',
  '& > *': {
    marginRight: theme.spacing(2),
  },
}));

const TYPE_DISPLAY = {
  host: 'Hôtes',
  service: 'Services'
};

const NagiosSummary = ({ data }) => {
  return (
    <Container>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <HeaderCell>
                <icons.menu.Nagios />
                {TYPE_DISPLAY[data.type]}
              </HeaderCell>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{'OK'}</TableCell>
            <TableCell>{'Warnings'}</TableCell>
            <TableCell>{'Errors'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <SuccessCell>{data.ok.toString()}</SuccessCell>
            <WarningCell>{data.warnings.toString()}</WarningCell>
            <ErrorCell>{data.errors.toString()}</ErrorCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

export default NagiosSummary;
