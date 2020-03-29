'use strict';

import { React, PropTypes, useSelector, mui, formatDate } from 'mylife-tools-ui';
import { geStatsView } from '../selectors';

const useConnect = () => useSelector(state => ({
  stats: geStatsView(state),
}));

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
}));

const Stats = ({ strategy }) => {
  const classes = useStyles();
  const { stats: allStats } = useConnect();

  const stats = Array.from(allStats
    .valueSeq()
    .filter(stat => stat.strategy === strategy._id)
    .sortBy(stat => -stat.openDate)
    .slice(0, 10));

  return (

    <mui.Table size='small'>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell>{'Date d\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Date de fermeture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à l\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à la fermeture'}</mui.TableCell>
          <mui.TableCell>{'Profit/perte'}</mui.TableCell>
        </mui.TableRow>
      </mui.TableHead>
      <mui.TableBody>
        {stats.map((stat) => (
          <mui.TableRow key={stat._id}>
            <mui.TableCell>{formatDate(stat.openDate, 'dd/MM/yyyy HH:mm:ss')}</mui.TableCell>
            <mui.TableCell>{formatDate(stat.closeDate, 'dd/MM/yyyy HH:mm:ss')}</mui.TableCell>
            <mui.TableCell>{stat.openLevel}</mui.TableCell>
            <mui.TableCell>{stat.closeLevel}</mui.TableCell>
            <mui.TableCell>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
    </mui.Table>
  );
};

Stats.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Stats;
