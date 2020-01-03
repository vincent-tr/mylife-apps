'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';

const WarnSyncingCard = ({ definition, ...props }) => {
  const delay = humanizeDuration(definition.delay, { language: 'fr', round: true });
  return (
    <mui.Card {...props}>
      <mui.CardContent>
        <mui.Typography variant='h5' component='h2'>
          Synchronisation en cours
        </mui.Typography>
        <mui.Typography variant='body2' component='p'>
          Dernier document intégré il y a {delay}
        </mui.Typography>
      </mui.CardContent>
      <mui.CardActions>
        <mui.Button size='small'>TODO</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

WarnSyncingCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default WarnSyncingCard;
