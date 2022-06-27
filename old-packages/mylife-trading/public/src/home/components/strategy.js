'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import StatsButton from './stats-button';
import StateButton from './state-button';
import Status from './status';
import Stats from './stats';
import { useUiSettings } from './ui-settings';

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  collapseContainer: {
    width: '100%'
  }
}));

const Strategy = ({ strategy }) => {
  const classes = useStyles();
  const { settings } = useUiSettings(strategy);

  return (
    <mui.Paper variant='outlined' square className={classes.container}>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={12}>
          <mui.Typography variant='h6'>{strategy.display}</mui.Typography>
        </mui.Grid>

        <mui.Grid item xs={12} className={classes.status}>
          <StatsButton strategy={strategy} />
          <StateButton strategy={strategy} />
          <Status strategy={strategy} />
        </mui.Grid>

        <mui.Collapse in={settings.showLastPositions} mountOnEnter unmountOnExit classes={{ container: classes.collapseContainer }}>
          <mui.Grid item xs={12}>
            <Stats strategy={strategy} />
          </mui.Grid>
        </mui.Collapse>

      </mui.Grid>
    </mui.Paper>
  );
};

Strategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Strategy;
