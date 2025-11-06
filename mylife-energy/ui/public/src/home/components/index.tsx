import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLifecycle, useActions, useInterval } from 'mylife-tools-ui';
import humanizeDurationImpl, { HumanizeDurationOptions } from 'humanize-duration';
import { enter, leave } from '../actions';
import { getDataView } from '../selectors';
import icons from '../../common/icons';
import { BatteryStatus } from '../../tesla/components';
import { makeStyles, Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  section: {
    margin: theme.spacing(2),
    padding: theme.spacing(4),
  },
  sectionTitle: {
    margin: theme.spacing(2),
  },
  lastUpdate: {
    fontStyle: 'italic',
  },
}));

const Home: React.FunctionComponent = () => {
  useViewLifecycle();
  const totalPower = useValue('live', 'total-power');
  const batteryLevel = useValue('tesla', 'battery-level');

  return (
    <div>
      <Section title={
        <>
          <icons.tabs.Live fontSize='inherit' />
          Live
        </>
      }>
        <Typography variant='h3'>
          <icons.devices.Total fontSize='inherit' />
          {totalPower?.toFixed()} W
        </Typography>

        <LastUpdate section='live' />
      </Section>

      <Section title={
        <>
          <icons.tabs.Tesla fontSize='inherit' />
          Tesla
        </>
      }>
        <BatteryStatus level={batteryLevel || 0} />
        <LastUpdate section='tesla' />
      </Section>

    </div>
  );
};

export default Home;

const Section: React.FunctionComponent<{ title: React.ReactNode; }> = ({ title, children}) => {
  const classes = useStyles();

  return (
    <Paper variant='outlined' className={classes.section}>
      <Typography variant='h1' className={classes.sectionTitle}>
        {title}
      </Typography>

      {children}
    </Paper>
  );
};

const LastUpdate: React.FunctionComponent<{ section: string }> = ({ section }) => {
  const classes = useStyles();
  const value = useLastUpdate(section);

  return (
    <Typography variant='body2' color='textSecondary' className={classes.lastUpdate}>
      Mis à jour il y a {value}
    </Typography>
  );
};

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useInterval(() => setNow(new Date()), 1000);
  return now;
}

function useValue(section: string, key: string) {
  const data = useSelector(getDataView);
  const item = data.get(`${section}/${key}`);
  return item?.value;
}

function useLastUpdate(section: string, key: string = 'last-update') {
  const now = useNow();
  const value: Date = useValue(section, key);
  if (!value) {
    return;
  }

  return humanizeDuration(now.valueOf() - value.valueOf());
}

const DEFAULT_FORMAT: HumanizeDurationOptions = { language: 'fr', largest: 2, round: true };

function humanizeDuration(ms: number, options?: HumanizeDurationOptions) {
  const format = { ...DEFAULT_FORMAT, ...options };
  return humanizeDurationImpl(ms, format);
}
