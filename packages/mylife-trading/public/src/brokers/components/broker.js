'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField, DeleteButton, ListSelector, services } from 'mylife-tools-ui';
import { update, remove } from '../actions';
import TestSettings from './test-settings';
import Credentials from './credentials';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    update: (broker, changes) => dispatch(update(broker, changes)),
    remove: (broker) => dispatch(remove(broker)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    width: 1400
  },
}));

const types = [
  { id: 'backtest', text: 'Backtesting' },
  { id: 'ig-demo', text: 'IG - Compte de démo' },
  { id: 'ig-real', text: 'IG - Compte réel' },
];

const BrokerDetail = ({ broker, update }) => {
  switch(broker.type) {
    case 'backtest':
      return (
        <TestSettings broker={broker} update={update} />
      )

    case 'ig-demo':
    case 'ig-real':
      return (
        <Credentials broker={broker} update={update} />
      )

    default:
      throw new Error(`Unknown broker type: ${broker.type}`);
  }
}

BrokerDetail.propTypes = {
  broker: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

const Broker = ({ broker }) => {
  const classes = useStyles();
  const { update, remove } = useConnect();

  return (
    <mui.Paper variant='outlined' square className={classes.container}>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={6}>
          <mui.Typography>{services.getFieldName('broker', 'display')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={broker.display} onChange={display => update(broker, { display })} fullWidth />
        </mui.Grid>

        <mui.Grid item xs={6}>
          <mui.Typography>{services.getFieldName('broker', 'type')}</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <ListSelector list={types} value={broker.type} onChange={type => update(broker, { type })} fullWidth />
        </mui.Grid>

        <BrokerDetail broker={broker} update={update} />

        <DeleteButton
          tooltip={'Supprimer le compte'}
          icon
          confirmText={`Etes-vous sûr de vouloir supprimer le compte '${services.renderObject(broker)}' ?`}
          onConfirmed={() => remove(broker)}
        />

      </mui.Grid>
    </mui.Paper>
  );
};

Broker.propTypes = {
  broker: PropTypes.object.isRequired,
};

export default Broker;
