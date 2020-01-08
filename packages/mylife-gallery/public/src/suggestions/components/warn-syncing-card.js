'use strict';

import { React, PropTypes, mui, useState, useInterval, useLifecycle } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';

const useStyles = mui.makeStyles(theme => ({
  icon: {
    color: theme.status.warning,
    marginRight: theme.spacing(2)
  }
}));

const WarnSyncingCard = ({ definition, ...props }) => {
  const classes = useStyles();
  const [delay, setDelay] = useState(0);
  const compute = () => setDelay(computeDelay(definition));

  useInterval(compute, 500);
  useLifecycle(compute);

  return (
    <mui.Card {...props}>
      <mui.CardHeader
        title={
          <>
            <mui.icons.Warning className={classes.icon} />
            Synchronisation en cours
          </>
        }
        subheader={`Dernier document intégré il y a ${delay}`}
      />
      <mui.CardContent>
        <mui.Typography color='textSecondary'>
          {'Vous devriez attendre la fin de la synchronisation avant d\'utiliser les suggestions'}
        </mui.Typography>
      </mui.CardContent>
    </mui.Card>
  );
};

WarnSyncingCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default WarnSyncingCard;

function computeDelay(definition) {
  const delay = Date.now() - definition.lastIntegration;
  return humanizeDuration(delay, { language: 'fr', round: true });
}
