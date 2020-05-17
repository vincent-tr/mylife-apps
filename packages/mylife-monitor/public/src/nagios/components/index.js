'use strict';

import humanizeDuration from 'humanize-duration';
import { React, useMemo, useState, useEffect, mui, useDispatch, useSelector, useLifecycle, formatDate, useInterval } from 'mylife-tools-ui';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';

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

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

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

const Service = ({ service }) => (
  <mui.TableRow>
    <mui.TableCell />
    <mui.TableCell />
    <mui.TableCell>{service.display}</mui.TableCell>
    <mui.TableCell>{formatStatus(service)}</mui.TableCell>
    <CommonState item={service} />
  </mui.TableRow>
);

const Host = ({ item }) => {
  const { host, services } = item;
  return (
    <>
      <mui.TableRow>
        <mui.TableCell />
        <mui.TableCell>{host.display}</mui.TableCell>
        <mui.TableCell />
        <mui.TableCell>{formatStatus(host)}</mui.TableCell>
        <CommonState item={host} />
      </mui.TableRow>
      {services.map(service => (
        <Service key={service._id} service={service} />
      ))}
    </>
  );
};

const Group = ({ item }) => (
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
      <Host key={child.host._id} item={child} />
    ))}
  </>
);

const Nagios = () => {
  const classes = useStyles();
  const { enter, leave, data } = useConnect();
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
              <mui.TableCell>{'Statut'}</mui.TableCell>
              <mui.TableCell>{'Dernier check'}</mui.TableCell>
              <mui.TableCell>{'Prochain check'}</mui.TableCell>
              <mui.TableCell>{'Essai'}</mui.TableCell>
              <mui.TableCell>{'Durée'}</mui.TableCell>
              <mui.TableCell>{'Texte'}</mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.TableBody>
            {data.map(item => (
              <Group key={item.group._id} item={item} />
            ))}
          </mui.TableBody>
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
