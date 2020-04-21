'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField, DeleteButton, ListSelector } from 'mylife-tools-ui';
import { update, remove, removeStats } from '../actions';
import { getFieldName, renderObject } from '../../common/metadata-utils';
import BrokerSelector from './broker-selector';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    update: (strategy, changes) => dispatch(update(strategy, changes)),
    remove: (strategy) => dispatch(remove(strategy)),
    removeStats: (strategy) => dispatch(removeStats(strategy)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    width: 1400
  },
}));

const implementations = [
  { id: 'm1-rsi-bb', text: 'Scalping M1 RSI BB' },
  { id: 'm1-sma-stochastic', text: 'Scalping M1 SMA Stochastique' },
  { id: 'm1-sma-sar', text: 'Scalping M1 SMA SAR' },
  { id: 'm1-3ema', text: 'Scalping M1 3EMA' },
];

const Strategy = ({ strategy }) => {
  const classes = useStyles();
  const { update, remove, removeStats } = useConnect();

  return (
    <mui.Paper variant='outlined' square className={classes.container}>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'display')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <DebouncedTextField value={strategy.display} onChange={display => update(strategy, { display })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'implementation')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <ListSelector list={implementations} value={strategy.implementation} onChange={implementation => update(strategy, { implementation })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'enabled')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <mui.Checkbox checked={strategy.enabled} onChange={e => update(strategy, { enabled: e.target.checked })} />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'broker')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <BrokerSelector value={strategy.broker} onChange={broker => update(strategy, { broker })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'instrumentId')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <DebouncedTextField value={strategy.instrumentId} onChange={instrumentId => update(strategy, { instrumentId })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <mui.Typography>{getFieldName('strategy', 'risk')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={8}>
          <DebouncedTextField value={strategy.risk} onChange={value => update(strategy, { risk: parseFloat(value) })} type='number' fullWidth />
        </mui.Grid>

        <mui.Grid item xs={4}>
          <DeleteButton
            tooltip={'Supprimer la stratégie'}
            icon
            confirmText={`Etes-vous sûr de vouloir supprimer la stratégie '${renderObject(strategy)}' ?`}
            onConfirmed={() => remove(strategy)}
            />
        </mui.Grid>
        <mui.Grid item xs={8}>
          <DeleteButton
            text={'Stats'}
            tooltip={'Supprimer les statistiques associées à la stratégie'}
            icon
            confirmText={`Etes-vous sûr de vouloir supprimer les statistiques associées à la stratégie '${renderObject(strategy)}' ?`}
            onConfirmed={() => removeStats(strategy)}
          />
        </mui.Grid>

      </mui.Grid>
    </mui.Paper>
  );
};

Strategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};

export default Strategy;
