import React from 'react';
import clsx from 'clsx';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';
import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'inline-block',
    width: 300,
    margin: theme.spacing(4)
  },
  headerCell: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(2)
    },
  },
  column: {
  }
}));

const TYPE_DISPLAY = {
  host: 'Hôtes',
  service: 'Services'
};

const NagiosSummary = ({ data }) => {
  const classes = { ...useStatusColorStyles(), ...useStyles() };
  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Nagios />
                {TYPE_DISPLAY[data.type]}
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.column}>{'OK'}</TableCell>
            <TableCell className={classes.column}>{'Warnings'}</TableCell>
            <TableCell className={classes.column}>{'Errors'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell className={clsx(classes.column, classes.success)}>{data.ok.toString()}</TableCell>
            <TableCell className={clsx(classes.column, classes.warning)}>{data.warnings.toString()}</TableCell>
            <TableCell className={clsx(classes.column, classes.error)}>{data.errors.toString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NagiosSummary;
