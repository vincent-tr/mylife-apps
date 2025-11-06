import React, { useMemo, useCallback } from 'react';
import { format as formatDate } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useLifecycle } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';
import { makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, Tooltip, Checkbox, ThemeProvider, TableBody, createTheme } from '@material-ui/core';

type FIXME_any = any;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
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

const Updates = () => {
  const classes = useStyles();
  const { enter, leave, data, criteria, changeCriteria } = useConnect();
  useLifecycle(enter, leave);

  const dataSorted = useMemo(
    () => data.valueSeq().sortBy(({ path }) => path.join('/')).toArray(),
    [data]
  );

  return (
    <div className={classes.container}>
      <TableContainer>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Nom'}</TableCell>
              <TableCell>
                {'Etat'}
                <Tooltip title={'N\'afficher que les dépassés/problèmes'}>
                  <Checkbox
                    color='primary' 
                    checked={criteria.onlyProblems}
                    onChange={e => changeCriteria({ onlyProblems: e.target.checked })}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>{'Version courante'}</TableCell>
              <TableCell>{'Dernière version'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {dataSorted.map(version => (
                <Version key={version._id} data={version} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Updates;

const Version = ({ data }) => {
  const classes = useStatusColorStyles();

  const getClass = useCallback((status) => {
    switch (status) {
      case 'uptodate':
        return classes.success;
      case 'outdated':
        return classes.warning;
      case 'unknown':
        return classes.error;
      default:
        throw new Error(`Unsupported status: '${status}'`);
    }
  }, [classes]);

  return (
    <>
      <TableRow className={getClass(data.status)}>
        <TableCell>{data.path.join('/')}</TableCell>
        <TableCell>{getStatusStr(data.status)}</TableCell>
        <TableCell><VersionItem value={data.currentVersion} date={data.currentCreated}/></TableCell>
        <TableCell><VersionItem value={data.latestVersion} date={data.latestCreated}/></TableCell>
      </TableRow>
    </>
  );
};

function getStatusStr(status) {
  switch (status) {
    case 'uptodate':
      return 'A jour';
    case 'outdated':
      return 'Dépassé';
    case 'unknown':
      return 'Inconnu';
    default:
      throw new Error(`Unsupported status: '${status}'`);
  }
}

const VersionItem: React.FunctionComponent<{ value: string; date: Date }> = ({ value, date }) => {
  const lastUpdate = useSince(date);

  if (!value) {
    return null;
  }

  const isDateNull = date < new Date(1900);
  const lastUpdateStr = isDateNull ? '' : ` (${formatDuration(lastUpdate)})`;

  const content = (
    <div>{value}{lastUpdateStr}</div>
  );

  if (isDateNull) {
    return content;
  } else {
    return (
      <Tooltip title={formatDate(date, 'dd/MM/yyyy HH:mm:ss')}>
        {content}
      </Tooltip>
    );
  }
};

function useConnect() {
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