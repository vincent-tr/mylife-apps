'use strict';

import { React, PropTypes, useSelector, mui, formatDate, useScreenSize } from 'mylife-tools-ui';
import { geStatsView } from '../selectors';

const useConnect = () => useSelector(state => ({
  stats: geStatsView(state),
}));

const useStyles = mui.makeStyles(theme => ({
  profit: {
    color: theme.palette.success.main,
  },
  loss: {
    color: theme.palette.error.main,
  },
}));

const Stats = ({ strategy }) => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const { stats: allStats } = useConnect();

  const stats = Array.from(allStats
    .valueSeq()
    .filter(stat => stat.strategy === strategy._id)
    .sortBy(stat => -stat.openDate)
    .slice(0, 10));

  if(!stats.length) {
    return null;
  }

  const currencyTotal = stats[0].currency;
  const profitTotal = Math.round(stats.reduce((acc, stat) => (acc + stat.profitAndLoss), 0) * 100) / 100;
  const profitClass = profitAndLoss => (profitAndLoss > 0 ? classes.profit : classes.loss);

  const normalLayout = (
    <mui.Table size='small'>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell>{'Date d\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Date de fermeture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à l\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à la fermeture'}</mui.TableCell>
          <mui.TableCell>{'Direction'}</mui.TableCell>
          <mui.TableCell>{'Taille'}</mui.TableCell>
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
            <mui.TableCell>{stat.size > 0 ? 'Achat' : 'Vente'}</mui.TableCell>
            <mui.TableCell>{Math.abs(stat.size)}</mui.TableCell>
            <mui.TableCell className={profitClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
      <mui.TableFooter>
        <mui.TableRow>
          <mui.TableCell>Total</mui.TableCell>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell className={profitClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
        </mui.TableRow>
      </mui.TableFooter>
    </mui.Table>
  );

  const smallLayout = (
    <mui.Table size='small'>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell>{'Date d\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Date de fermeture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à l\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à la fermeture'}</mui.TableCell>
          <mui.TableCell>{'Direction'}</mui.TableCell>
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
            <mui.TableCell>{stat.size > 0 ? 'Achat' : 'Vente'}</mui.TableCell>
            <mui.TableCell className={profitClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
      <mui.TableFooter>
        <mui.TableRow>
          <mui.TableCell>Total</mui.TableCell>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell className={profitClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
        </mui.TableRow>
      </mui.TableFooter>
    </mui.Table>
  );

  const tinyLayout = (
    <mui.Table size='small'>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell>{'Date d\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Profit/perte'}</mui.TableCell>
        </mui.TableRow>
      </mui.TableHead>
      <mui.TableBody>
        {stats.map((stat) => (
          <mui.TableRow key={stat._id}>
            <mui.TableCell>{formatDate(stat.openDate, 'dd/MM/yyyy HH:mm:ss')}</mui.TableCell>
            <mui.TableCell className={profitClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
      <mui.TableFooter>
        <mui.TableRow>
          <mui.TableCell>Total</mui.TableCell>
          <mui.TableCell className={profitClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
        </mui.TableRow>
      </mui.TableFooter>
    </mui.Table>
  );

  switch(screenSize) {
    case 'phone':
      return tinyLayout;

    case 'tablet':
      return smallLayout;

    case 'laptop':
    case 'wide':
      return normalLayout;
  }

};

Stats.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Stats;
