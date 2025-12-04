import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import humanizeDurationImpl, { HumanizeDurationOptions } from 'humanize-duration';
import React, { PropsWithChildren, useState } from 'react';
import { useInterval } from 'mylife-tools';
import icons from '../../common/icons';
import { useAppSelector } from '../../store-api';
import { BatteryStatus } from '../../tesla/components';
import { getHomeDataView, useHomeDataView } from '../views';

const SectionRoot = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const LastUpdateText = styled(Typography)({
  fontStyle: 'italic',
});

export default function Home() {
  useHomeDataView();
  const totalPower = useValue('live', 'total-power');
  const batteryLevel = useValue('tesla', 'battery-level');

  return (
    <div>
      <Section
        title={
          <>
            <icons.tabs.Live fontSize="inherit" />
            Live
          </>
        }
      >
        <Typography variant="h3">
          <icons.devices.Total fontSize="inherit" />
          {totalPower?.toFixed()} W
        </Typography>

        <LastUpdate section="live" />
      </Section>

      <Section
        title={
          <>
            <icons.tabs.Tesla fontSize="inherit" />
            Tesla
          </>
        }
      >
        <BatteryStatus level={batteryLevel || 0} />
        <LastUpdate section="tesla" />
      </Section>
    </div>
  );
}

interface SectionProps extends PropsWithChildren {
  title: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <SectionRoot variant="outlined">
      <SectionTitle variant="h1">{title}</SectionTitle>

      {children}
    </SectionRoot>
  );
}

interface LastUpdateProps {
  section: string;
}

function LastUpdate({ section }: LastUpdateProps) {
  const value = useLastUpdate(section);

  return (
    <LastUpdateText variant="body2" color="textSecondary">
      Mis à jour il y a {value}
    </LastUpdateText>
  );
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useInterval(() => setNow(new Date()), 1000);
  return now;
}

function useValue(section: string, key: string) {
  const data = useAppSelector(getHomeDataView);
  const item = data[`${section}/${key}`];
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
