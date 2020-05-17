'use strict';

import humanizeDuration from 'humanize-duration';
import { React, useMemo, useState, useEffect, mui, useDispatch, useSelector, useLifecycle, formatDate, useInterval } from 'mylife-tools-ui';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';
import { HOST_STATUS_PROBLEM } from '../problems';

const useConnect = () => {
  const dispatch = useDispatch();
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

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  },
  success: {
    backgroundColor: mui.fade(theme.palette.success.main, 0.25),
  },
  warning: {
    backgroundColor: mui.fade(theme.palette.warning.main, 0.25),
  },
  error: {
    backgroundColor: mui.fade(theme.palette.error.main, 0.25),
  }
}));

const CommonState = ({ item }) => {
  const duration = useSince(item.lastStateChange);
  return (
    <>
      <mui.TableCell>{formatTimestamp(item.lastCheck)}</mui.TableCell>
      <mui.TableCell>{formatTimestamp(item.nextCheck)}</mui.TableCell>
      <mui.TableCell>{`${item.currentAttempt}/${item.maxAttempts}`}</mui.TableCell>
      <mui.TableCell>{duration}</mui.TableCell>
      <mui.TableCell>{item.statusText}</mui.TableCell>
    </>
  );
};

const Service = ({ criteria, service, hostDisplay }) => {
  const classes = useStyles();
  const lclasses = serviceStatusClass(service.status, classes);
  return (
    <mui.TableRow className={lclasses.row}>
      <mui.TableCell />
      <mui.TableCell>{criteria.onlyProblems && hostDisplay}</mui.TableCell>
      <mui.TableCell>{service.display}</mui.TableCell>
      <mui.TableCell className={lclasses.cell}>{formatStatus(service)}</mui.TableCell>
      <CommonState item={service} />
    </mui.TableRow>
  );
};

const Host = ({ criteria, item }) => {
  const classes = useStyles();
  const { host, services } = item;
  const lclasses = hostStatusClass(host.status, classes);
  const displayRow = !criteria.onlyProblems || HOST_STATUS_PROBLEM[host.status];
  return (
    <>
      {displayRow && (
        <mui.TableRow className={lclasses.row}>
          <mui.TableCell />
          <mui.TableCell>{host.display}</mui.TableCell>
          <mui.TableCell />
          <mui.TableCell className={lclasses.cell}>{formatStatus(host)}</mui.TableCell>
          <CommonState item={host} />
        </mui.TableRow>
      )}
      {services.map(service => (
        <Service key={service._id} criteria={criteria} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
};

const Group = ({ criteria, item }) => (
  <>
    <mui.TableRow>
      <mui.TableCell>{item.group.display}</mui.TableCell>
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
      <mui.TableCell />
    </mui.TableRow>
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
      <mui.TableContainer>
        <mui.Table size='small' stickyHeader>
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell>{'Groupe'}</mui.TableCell>
              <mui.TableCell>{'Hôte'}</mui.TableCell>
              <mui.TableCell>{'Service'}</mui.TableCell>
              <mui.TableCell>
                {'Statut'}
                <mui.Tooltip title={'N\'afficher que les problèmes'}>
                  <mui.Checkbox
                    color='primary' 
                    checked={criteria.onlyProblems}
                    onChange={e => changeCriteria({ onlyProblems: e.target.checked })}
                  />
                </mui.Tooltip>
              </mui.TableCell>
              <mui.TableCell>{'Dernier check'}</mui.TableCell>
              <mui.TableCell>{'Prochain check'}</mui.TableCell>
              <mui.TableCell>{'Essai'}</mui.TableCell>
              <mui.TableCell>{'Durée'}</mui.TableCell>
              <mui.TableCell>{'Texte'}</mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.ThemeProvider theme={mui.createMuiTheme({ typography: { fontSize: 10 } })}>
            <mui.TableBody>
              {data.map(item => (
                <Group key={item.group._id} criteria={criteria} item={item} />
              ))}
            </mui.TableBody>
          </mui.ThemeProvider>
        </mui.Table>
      </mui.TableContainer>
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

function useSince(timestamp) {
  const [duration, setDuration] = useState();

  useEffect(computeDuration, [timestamp]);
  useInterval(computeDuration, 500);

  return duration;

  function computeDuration() {
    if(!timestamp) {
      setDelay(null);
      return;
    }
  
    const rawDuration = new Date() - timestamp;
    const formatted = humanizeDuration(rawDuration, { language: 'fr', largest: 1, round: true });
    setDuration(formatted);
  }
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