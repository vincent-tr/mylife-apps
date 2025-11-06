import React, { useMemo, useCallback } from 'react';
import { mui, useDispatch, useSelector, useLifecycle, formatDate } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';

type FIXME_any = any;

const useStyles = mui.makeStyles(theme => ({
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
      <mui.TableContainer>
        <mui.Table size='small' stickyHeader>
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell>{'Nom'}</mui.TableCell>
              <mui.TableCell>
                {'Etat'}
                <mui.Tooltip title={'N\'afficher que les dépassés/problèmes'}>
                  <mui.Checkbox
                    color='primary' 
                    checked={criteria.onlyProblems}
                    onChange={e => changeCriteria({ onlyProblems: e.target.checked })}
                  />
                </mui.Tooltip>
              </mui.TableCell>
              <mui.TableCell>{'Version courante'}</mui.TableCell>
              <mui.TableCell>{'Dernière version'}</mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.ThemeProvider theme={mui.createTheme({ typography: { fontSize: 10 } })}>
            <mui.TableBody>
              {dataSorted.map(version => (
                <Version key={version._id} data={version} />
              ))}
            </mui.TableBody>
          </mui.ThemeProvider>
        </mui.Table>
      </mui.TableContainer>
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
      <mui.TableRow className={getClass(data.status)}>
        <mui.TableCell>{data.path.join('/')}</mui.TableCell>
        <mui.TableCell>{getStatusStr(data.status)}</mui.TableCell>
        <mui.TableCell><VersionItem value={data.currentVersion} date={data.currentCreated}/></mui.TableCell>
        <mui.TableCell><VersionItem value={data.latestVersion} date={data.latestCreated}/></mui.TableCell>
      </mui.TableRow>
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
      <mui.Tooltip title={formatDate(date, 'dd/MM/yyyy HH:mm:ss')}>
        {content}
      </mui.Tooltip>
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