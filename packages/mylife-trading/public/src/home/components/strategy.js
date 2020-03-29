'use strict';

import { React, PropTypes, useMemo, useSelector, mui, useDispatch } from 'mylife-tools-ui';
import { changeState } from '../actions';
import Status from './status';
import Stats from './stats';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    changeState: (strategy, enabled) => dispatch(changeState(strategy, enabled)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
}));

const Strategy = ({ strategy }) => {
  const classes = useStyles();
  const { changeState } = useConnect();

  return (
    <mui.Paper variant='outlined' square className={classes.container}>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={12}>
          <mui.Typography variant='h6'>{strategy.display}</mui.Typography>
        </mui.Grid>

        <mui.Grid item xs={12}>
          <mui.Button onClick={() => changeState(strategy, !strategy.enabled)}>
            {strategy.enabled ? 'Arrêter' : 'Démarrer'}
          </mui.Button>
          <Status strategy={strategy} />
        </mui.Grid>

        <mui.Grid item xs={12}>
          <Stats strategy={strategy} />
        </mui.Grid>

      </mui.Grid>
    </mui.Paper>
  );
};

Strategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Strategy;
