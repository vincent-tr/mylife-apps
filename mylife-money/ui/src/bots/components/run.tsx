import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled, darken } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { CriteriaField } from 'mylife-tools';
import { BotRun, BotRunLogSeverity, BotRunLog } from '../../api';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const GridContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

const LogsList = styled('div')({
  flex: '1 1 auto',
  overflowY: 'auto',
  height: 1, // else use gigantic height if log of logs, with no scroll ?!?
});

const LogRow = styled('span')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontFamily: 'monospace',
  display: 'inline',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}));

const LogTimestamp = styled('span')(({ theme }) => ({
  color: darken(theme.palette.background.paper, 0.5),
}));

const Run: React.FC<{ run: BotRun; className?: string }> = ({ run, className }) => (
  <Container className={className}>
    <GridContainer>
      <Grid container spacing={2}>
        <Grid size={6}>
          <CriteriaField label={'Début'}>
            <Typography>{run.start.toLocaleString('fr-FR')}</Typography>
          </CriteriaField>
        </Grid>

        <Grid size={6}>
          <CriteriaField label={'Fin'}>
            <Typography>{run.end?.toLocaleString('fr-FR') || '-'}</Typography>
          </CriteriaField>
        </Grid>

        <Grid size={12}>
          <RunResult value={run.result} />
        </Grid>
      </Grid>
    </GridContainer>

    <Divider />

    <LogsList>
      {(run.logs as BotRunLog[]).map((log, index) => (
        <LogRow key={index}>
          <Timestamp value={log.date} />
          <Space />
          <Level value={log.severity} />
          <Space />
          <Message value={log.message} />
          <LineEnd />
        </LogRow>
      ))}
    </LogsList>
  </Container>
);

export default Run;

const ResultTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'value',
})<{ value: 'success' | 'warning' | 'error' }>(({ theme, value }) => {
  switch (value) {
    case 'success':
      return theme.palette.success.main;
    case 'warning':
      return theme.palette.warning.main;
    case 'error':
      return theme.palette.error.main;
  }
});

const RunResult: React.FC<{ value: 'success' | 'warning' | 'error' }> = ({ value }) => {
  if (!value) {
    return <Typography>{'-'}</Typography>;
  }

  return <ResultTypography value={value}>{value.toUpperCase()}</ResultTypography>;
};

const Timestamp: React.FC<{ value: Date }> = ({ value }) => {
  return <LogTimestamp>{value.toLocaleString('fr-FR')}</LogTimestamp>;
};

const LevelSpan = styled('span', {
  shouldForwardProp: (prop) => prop !== 'severity',
})<{ severity: BotRunLogSeverity }>(({ theme, severity }) => {
  switch (severity) {
    case 'fatal':
      return {
        // inverse
        color: theme.palette.background.default,
        background: theme.palette.text.primary,
      };
    case 'error':
      return {
        // red
        color: '#cd3131',
      };
    case 'warning':
      return {
        // magenta
        color: '#bc05bc',
      };
    case 'info':
      return {
        // cyan
        color: '#0598bc',
      };
    case 'debug':
      return {
        // yellow
        color: '#949800',
      };
  }
});

const Level: React.FC<{ value: BotRunLogSeverity }> = ({ value }) => {
  return <LevelSpan severity={value}>{value.toUpperCase()}</LevelSpan>;
};

const Message: React.FC<{ value: string }> = ({ value }) => {
  return <span>{value}</span>;
};

const Space: React.FC = () => {
  return <span> </span>;
};

const LineEnd: React.FC = () => {
  return <span>{'\n'}</span>;
};
