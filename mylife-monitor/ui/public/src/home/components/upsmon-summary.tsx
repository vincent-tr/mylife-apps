'use strict';

import humanizeDuration from 'humanize-duration';
import { React, mui, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';

const useStyles = mui.makeStyles(theme => ({
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
    <mui.TableContainer component={mui.Paper} className={classes.container}>
      <mui.Table size='small'>
        <mui.TableHead>
          <mui.TableRow>
            <mui.TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Upsmon />
                {'UPS Monitor'}
              </div>
            </mui.TableCell>
          </mui.TableRow>
          <mui.TableRow>
            <mui.TableCell className={classes.column}>{'Nom'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Statut'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Mise à jour'}</mui.TableCell>
          </mui.TableRow>
        </mui.TableHead>

        <mui.TableBody>
          {view.valueSeq().map(data => (
            <Row key={data._id} data={data} />
          ))}
        </mui.TableBody>
      </mui.Table>
    </mui.TableContainer>
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
    <mui.TableRow>
      <mui.TableCell className={clsx(classes.column)}>{data.upsName}</mui.TableCell>
      <mui.TableCell className={clsx(classes.column, statusOk ? classes.success : classes.error)}>{data.status}</mui.TableCell>
      <mui.TableCell className={clsx(classes.column, lastUpdateOk ? classes.success : classes.error)}>{lastUpdateStr}</mui.TableCell>
    </mui.TableRow>
  );
}
