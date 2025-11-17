import React from 'react';
import { styled, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import icons from '../../common/icons';
import { SuccessCell, WarningCell, ErrorCell } from '../../common/table-status';

const Container = styled(Paper)(({ theme }) => ({
  display: 'inline-block',
  width: 400,
  margin: theme.spacing(4),
}));

const HeaderCell = styled('div')(({ theme }) => ({
  display: 'flex',
  '& > *': {
    marginRight: theme.spacing(2),
  },
}));

const UpdatesSummary = ({ view }) => {
  return (
    <Container>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <HeaderCell>
                <icons.menu.Updates />
                {'Updates'}
              </HeaderCell>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{'Catégorie'}</TableCell>
            <TableCell>{'OK'}</TableCell>
            <TableCell>{'Dépassés'}</TableCell>
            <TableCell>{'Inconnus'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(view).map(data => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default UpdatesSummary;

const Row = ({ data }) => {
  return (
    <TableRow>
      <TableCell>{data.category}</TableCell>
      <SuccessCell>{data.ok}</SuccessCell>
      <WarningCell>{data.outdated}</WarningCell>
      <ErrorCell>{data.unknown}</ErrorCell>
    </TableRow>
  );
}
