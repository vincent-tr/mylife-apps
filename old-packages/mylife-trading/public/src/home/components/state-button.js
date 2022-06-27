'use strict';

import { React, PropTypes, useMemo, mui, useDispatch } from 'mylife-tools-ui';
import { changeState } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    changeState: (strategy, enabled) => dispatch(changeState(strategy, enabled)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  start: {
    color: theme.palette.getContrastText(theme.palette.success.dark),
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    }
  },
  stop: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  }
}));

const StateButton = ({ strategy }) => {
  const classes = useStyles();
  const { changeState } = useConnect();

  const onClick = () => changeState(strategy, !strategy.enabled);
  const className = strategy.enabled ? classes.stop : classes.start;
  const Icon = strategy.enabled ? mui.icons.Stop : mui.icons.PlayArrow;
  const title = strategy.enabled ? 'Arrêter' : 'Démarrer';

  return (
    <mui.Tooltip title={title}>
      <mui.IconButton className={className} onClick={onClick}>
        <Icon />
      </mui.IconButton>
    </mui.Tooltip>
  );
};

StateButton.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default StateButton;
