import { React, mui, clsx, CriteriaField, DeleteButton, useSelector, useCallback, useAction, useActions, useLifecycle, fireAsync, useEffect, useState, ListContainer, services } from 'mylife-tools-ui';

type FIXME_any = any;
type Bot = FIXME_any;
type BotRun = FIXME_any;

// FIXME: should be in entities
type BotRunLogSeverity = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

// FIXME: should be in entities
interface BotRunLog {
  date: Date;
  severity: BotRunLogSeverity;
  message: string;
}

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    padding: theme.spacing(1),
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 auto',
  },
  list: {
    width: 210,
    minWidth: 210,
  },
  content: {
    flex: '1 1 auto',
  },
  logsList: {
    flex: '1 1 auto',
    overflowY: 'auto',
    height: 1 // else use gigantic height if log of logs, with no scroll ?!?
  },
  logRow: {
    marginLeft: theme.spacing(2),
    fontFamily: 'monospace',
    display: 'inline',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
  logTimestamp: {
    color: mui.darken(theme.palette.background.paper, 0.5),
  },
  logLevel: {

  },
  logMessage: {

  },
}));

const Run: React.FunctionComponent<{ run: BotRun; className?: string }> = ({ run, className }) => {
  const classes = useStyles();
  const structure = services.getFieldDatatype('bot', 'lastRun');

  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.gridContainer}>
        <mui.Grid container spacing={2}>
          <mui.Grid item xs={6}>
            <CriteriaField label={services.getStructureFieldName(structure, 'start')}>
              <mui.Typography>{run.start.toLocaleString('fr-FR')}</mui.Typography>
            </CriteriaField>
          </mui.Grid>

          <mui.Grid item xs={6}>
            <CriteriaField label={services.getStructureFieldName(structure, 'end')}>
              <mui.Typography>{run.end?.toLocaleString('fr-FR') || '-'}</mui.Typography>
            </CriteriaField>
          </mui.Grid>

          <mui.Grid item xs={12}>
            <RunResult value={run.result} />
          </mui.Grid>
        </mui.Grid>
      </div>

      <mui.Divider />
  
      <div className={classes.logsList}>
        {(run.logs as BotRunLog[]).map((log, index) => (
          <span key={index} className={classes.logRow}>
            <Timestamp value={log.date} />
            <Space />
            <Level value={log.severity} />
            <Space />
            <Message value={log.message} />
            <LineEnd />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Run;

const useResultStyles = mui.makeStyles(theme => ({
  success: {
    color: theme.palette.success.main
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const RunResult: React.FunctionComponent<{ value: 'success' | 'warning' | 'error' }> = ({ value }) => {
  const classes = useResultStyles();

  if (!value) {
    return (
      <mui.Typography>
        {'-'}
      </mui.Typography>
    );
  }

  return (
    <mui.Typography className={classes[value]}>
      {value.toUpperCase()}
    </mui.Typography>
  );
};

const Timestamp: React.FunctionComponent<{ value: Date }> = ({ value }) => {
  const classes = useStyles();
  return (
    <span className={classes.logTimestamp}>
      {value.toLocaleString('fr-FR')}
    </span>
  );
};

const useLevelStyles = mui.makeStyles((theme) => ({
  fatal: {
    // inverse
    color: theme.palette.background.default,
    background: theme.palette.text.primary,
  },
  error: {
    // red
    color: '#cd3131',
  },
  warning: {
    // magenta
    color: '#bc05bc',
  },
  info: {
    // cyan
    color: '#0598bc',
  },
  debug: {
    // yellow
    color: '#949800',
  },
}));

const Level: React.FunctionComponent<{ value: BotRunLogSeverity }> = ({ value }) => {
  const classes = useStyles();
  const levelClasses = useLevelStyles();

  return (
    <span className={clsx(classes.logLevel, levelClasses[value])}>
      {value.toUpperCase()}
    </span>
  );
};

const Message: React.FunctionComponent<{ value: string }> = ({ value }) => {
  const classes = useStyles();
  return (
    <span className={classes.logMessage}>
      {value}
    </span>
  );
};

const Space: React.FunctionComponent = () => {
  return (
    <span>
      {' '}
    </span>
  );
};

const LineEnd: React.FunctionComponent = () => {
  return (
    <span>
      {'\n'}
    </span>
  );
};
