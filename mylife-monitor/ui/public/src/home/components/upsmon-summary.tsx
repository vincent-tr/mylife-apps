'use strict';

import humanizeDuration from 'humanize-duration';
import React from 'react';
import clsx from 'clsx';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

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

const formatDuration = humanizeDuration.humanizer({
  language: 'shortFr',
  largest: 1,
  round: true,

  languages: {
    shortFr: {
      y: () => "ans",
      mo: () => "mois",
      w: () => "semaines",
      d: () => "jours",
      h: () => "heures",
      m: () => "min",
      s: () => "sec",
      ms: () => "ms",
    },
  },
});

const UpsmonSummary = ({ view }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Upsmon />
                {'UPS Monitor'}
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.column}>{'Nom'}</TableCell>
            <TableCell className={classes.column}>{'Statut'}</TableCell>
            <TableCell className={classes.column}>{'Mise à jour'}</TableCell>
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

export default UpsmonSummary;

const Row = ({ data }) => {
  const classes = { ...useStatusColorStyles(), ...useStyles() };
  const statusOk = data.status == 'ONLINE';
  const lastUpdate = useSince(data.date);
  const lastUpdateOk = lastUpdate < 5 * 60 * 1000; // 5 mins
  const lastUpdateStr = formatDuration(lastUpdate);

  return (
    <TableRow>
      <TableCell className={clsx(classes.column)}>{data.upsName}</TableCell>
      <TableCell className={clsx(classes.column, statusOk ? classes.success : classes.error)}>{data.status}</TableCell>
      <TableCell className={clsx(classes.column, lastUpdateOk ? classes.success : classes.error)}>{lastUpdateStr}</TableCell>
    </TableRow>
  );
}
