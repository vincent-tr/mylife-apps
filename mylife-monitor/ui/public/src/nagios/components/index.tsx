'use strict';

import humanizeDuration from 'humanize-duration';
import React, { useMemo } from 'react';
import { format as formatDate } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useLifecycle } from 'mylife-tools-ui';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';
import { HOST_STATUS_PROBLEM } from '../problems';
import { makeStyles, TableCell, TableRow, TableContainer, Table, TableHead, Tooltip, Checkbox, ThemeProvider, TableBody, createTheme } from '@material-ui/core';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      criteria: getCriteria(state),
      data: getDisplayView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
    }), [dispatch])
  };
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
}));

const CommonState = ({ item }) => {
  const rawDuration = useSince(item.lastStateChange);
  const duration = rawDuration && humanizeDuration(rawDuration, { language: 'fr', largest: 1, round: true });
  return (
    <>
      <TableCell>{formatTimestamp(item.lastCheck)}</TableCell>
      <TableCell>{formatTimestamp(item.nextCheck)}</TableCell>
      <TableCell>{`${item.currentAttempt}/${item.maxAttempts}`}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>{item.statusText}</TableCell>
    </>
  );
};

const Service = ({ criteria, service, hostDisplay }) => {
  const classes = useStatusColorStyles();
  const lclasses = serviceStatusClass(service.status, classes);
  return (
    <TableRow className={lclasses.row}>
      <TableCell />
      <TableCell>{criteria.onlyProblems && hostDisplay}</TableCell>
      <TableCell>{service.display}</TableCell>
      <TableCell className={lclasses.cell}>{formatStatus(service)}</TableCell>
      <CommonState item={service} />
    </TableRow>
  );
};

const Host = ({ criteria, item }) => {
  const classes = useStatusColorStyles();
  const { host, services } = item;
  const lclasses = hostStatusClass(host.status, classes);
  const displayRow = !criteria.onlyProblems || HOST_STATUS_PROBLEM[host.status];
  return (
    <>
      {displayRow && (
        <TableRow className={lclasses.row}>
          <TableCell />
          <TableCell>{host.display}</TableCell>
          <TableCell />
          <TableCell className={lclasses.cell}>{formatStatus(host)}</TableCell>
          <CommonState item={host} />
        </TableRow>
      )}
      {services.map(service => (
        <Service key={service._id} criteria={criteria} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
};

const Group = ({ criteria, item }) => (
  <>
    <TableRow>
      <TableCell>{item.group.display}</TableCell>
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
    </TableRow>
    {item.hosts.map(child => (
      <Host key={child.host._id} criteria={criteria} item={child} />
    ))}
  </>
);

const Nagios = () => {
  const classes = useStyles();
  const { enter, leave, data, criteria, changeCriteria } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <TableContainer>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Groupe'}</TableCell>
              <TableCell>{'Hôte'}</TableCell>
              <TableCell>{'Service'}</TableCell>
              <TableCell>
                {'Statut'}
                <Tooltip title={'N\'afficher que les problèmes'}>
                  <Checkbox
                    color='primary' 
                    checked={criteria.onlyProblems}
                    onChange={e => changeCriteria({ onlyProblems: e.target.checked })}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>{'Dernier check'}</TableCell>
              <TableCell>{'Prochain check'}</TableCell>
              <TableCell>{'Essai'}</TableCell>
              <TableCell>{'Durée'}</TableCell>
              <TableCell>{'Texte'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {data.map(item => (
                <Group key={item.group._id} criteria={criteria} item={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Nagios;

function formatStatus(item) {
  let value = item.status.toUpperCase();
  if(item.isFlapping) {
    value += ' (instable)';
  }
  return value;
}

function formatTimestamp(date) {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return formatDate(date, isToday ? 'HH:mm:ss' : 'dd/MM/yyyy HH:mm:ss');
}

const HOST_STATUS_CLASSES = {
  pending: null,
  up: 'success',
  down: 'error',
  unreachable: 'error'
};

const SERVICE_STATUS_CLASSES = {
  pending: null,
  ok: 'success',
  warning: 'warning',
  unknown: 'error',
  critical: 'error',
};

function statusClass(value, classes) {
  if(!value) {
    return { row: null, cell: null };
  }

  if(value === 'success') {
    return { row: null, cell: classes[value] };
  }

  return { row: classes[value] , cell: null };
}

function hostStatusClass(status, classes) {
  const value = HOST_STATUS_CLASSES[status];
  return statusClass(value, classes);
}

function serviceStatusClass(status, classes) {
  const value = SERVICE_STATUS_CLASSES[status];
  return statusClass(value, classes);
}