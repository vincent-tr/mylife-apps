'use strict';

import React from 'react';
import clsx from 'clsx';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';
import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'inline-block',
    width: 400,
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

const UpdatesSummary = ({ view }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Updates />
                {'Updates'}
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.column}>{'Catégorie'}</TableCell>
            <TableCell className={classes.column}>{'OK'}</TableCell>
            <TableCell className={classes.column}>{'Dépassés'}</TableCell>
            <TableCell className={classes.column}>{'Inconnus'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {view.valueSeq().map(data => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UpdatesSummary;

const Row = ({ data }) => {
  const classes = { ...useStatusColorStyles(), ...useStyles() };

  return (
    <TableRow>
      <TableCell className={clsx(classes.column)}>{data.category}</TableCell>
      <TableCell className={clsx(classes.column, classes.success)}>{data.ok}</TableCell>
      <TableCell className={clsx(classes.column, classes.warning)}>{data.outdated}</TableCell>
      <TableCell className={clsx(classes.column, classes.error)}>{data.unknown}</TableCell>
    </TableRow>
  );
}
