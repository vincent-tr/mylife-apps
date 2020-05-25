'use strict';

import { React, PropTypes, mui, formatDate, useScreenSize } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';
import { useStatView } from '../../common/shared-views';

const useStyles = mui.makeStyles(theme => ({
  profit: {
    color: theme.palette.success.main,
  },
  loss: {
    color: theme.palette.error.main,
  },
}));

const StatsTable = ({ strategy, count }) => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const { view } = useStatView();

  const stats = Array.from(view
    .valueSeq()
    .filter(stat => stat.strategy === strategy._id)
    .sortBy(stat => -stat.openDate)
    .slice(0, count));

  if(!stats.length) {
    return null;
  }

  const currencyTotal = stats[0].currency;
  const profitTotal = Math.round(stats.reduce((acc, stat) => (acc + stat.profitAndLoss), 0) * 100) / 100;
  const valueClass = value => (value > 0 ? classes.profit : classes.loss);

  const largeLayout = (
    <mui.Table size='small'>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell>{'Date d\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Date de fermeture'}</mui.TableCell>
          <mui.TableCell>{'Durée'}</mui.TableCell>
          <mui.TableCell>{'Niveau à l\'ouverture'}</mui.TableCell>
          <mui.TableCell>{'Niveau à la fermeture'}</mui.TableCell>
          <mui.TableCell>{'Ecart'}</mui.TableCell>
          <mui.TableCell>{'Direction'}</mui.TableCell>
          <mui.TableCell>{'Taille'}</mui.TableCell>
          <mui.TableCell>{'Profit/perte'}</mui.TableCell>
        </mui.TableRow>
      </mui.TableHead>
      <mui.TableBody>
        {stats.map((stat) => {
          const dateDiff = humanizeDuration(stat.closeDate - stat.openDate, { language: 'fr' });
          const levelDiff = stat.closeLevel - stat.openLevel;

          return (
            <mui.TableRow key={stat._id}>
              <mui.TableCell>{formatDate(stat.openDate, 'dd/MM/yyyy HH:mm:ss')}</mui.TableCell>
              <mui.TableCell>{formatDate(stat.closeDate, 'dd/MM/yyyy HH:mm:ss')}</mui.TableCell>
              <mui.TableCell>{dateDiff}</mui.TableCell>
              <mui.TableCell>{stat.openLevel.toFixed(5)}</mui.TableCell>
              <mui.TableCell>{stat.closeLevel.toFixed(5)}</mui.TableCell>
              <mui.TableCell className={valueClass(levelDiff)}>{levelDiff.toFixed(5)}</mui.TableCell>
              <mui.TableCell>{stat.size > 0 ? 'Achat' : 'Vente'}</mui.TableCell>
              <mui.TableCell>{Math.abs(stat.size)}</mui.TableCell>
              <mui.TableCell className={valueClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
            </mui.TableRow>
          );
        })}
      </mui.TableBody>
      <mui.TableFooter>
        <mui.TableRow>
          <mui.TableCell>Total</mui.TableCell>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell/>
          <mui.TableCell className={valueClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
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
            <mui.TableCell>{stat.openLevel.toFixed(5)}</mui.TableCell>
            <mui.TableCell>{stat.closeLevel.toFixed(5)}</mui.TableCell>
            <mui.TableCell>{stat.size > 0 ? 'Achat' : 'Vente'}</mui.TableCell>
            <mui.TableCell className={valueClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
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
          <mui.TableCell className={valueClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
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
            <mui.TableCell className={valueClass(stat.profitAndLoss)}>{stat.profitAndLoss}&nbsp;{stat.currency}</mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
      <mui.TableFooter>
        <mui.TableRow>
          <mui.TableCell>Total</mui.TableCell>
          <mui.TableCell className={valueClass(profitTotal)}>{profitTotal}&nbsp;{currencyTotal}</mui.TableCell>
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
      return largeLayout;
  }

};

StatsTable.propTypes = {
  strategy: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
};
  
export default StatsTable;
