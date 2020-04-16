'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField, DeleteButton, ListSelector } from 'mylife-tools-ui';
import { update, remove } from '../actions';
import { getFieldName, renderObject } from '../../common/metadata-utils';
import BrokerSelector from './broker-selector';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    update: (strategy, changes) => dispatch(update(strategy, changes)),
    remove: (strategy) => dispatch(remove(strategy)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
}));

const implementations = [
  { id: 'forex-scalping-m1-extreme', text: 'Forex scalping M1 extrême' },
  { id: 'forex-scalping-m1-extreme-stochastic', text: 'Forex scalping M1 extrême stochastique' },
];

const Strategy = ({ strategy }) => {
  const classes = useStyles();
  const { update, remove } = useConnect();

  return (
    <mui.Paper variant='outlined' square className={classes.container}>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'display')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={strategy.display} onChange={display => update(strategy, { display })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'implementation')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <ListSelector list={implementations} value={strategy.implementation} onChange={implementation => update(strategy, { implementation })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'enabled')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <mui.Checkbox checked={strategy.enabled} onChange={e => update(strategy, { enabled: e.target.checked })} />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'broker')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <BrokerSelector value={strategy.broker} onChange={broker => update(strategy, { broker })} />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'instrumentId')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={strategy.instrumentId} onChange={instrumentId => update(strategy, { instrumentId })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{getFieldName('strategy', 'risk')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={strategy.risk} onChange={risk => update(strategy, { risk })} type='number' fullWidth />
        </mui.Grid>

        <DeleteButton
          tooltip={'Supprimer le compte'}
          icon
          confirmText={`Etes-vous sûr de vouloir supprimer le compte '${renderObject(strategy)}' ?`}
          onConfirmed={() => remove(strategy)}
        />

      </mui.Grid>
    </mui.Paper>
  );
};

Strategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};

export default Strategy;
