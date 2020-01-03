'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';

const WarnSyncingCard = ({ definition, ...props }) => {
  const delay = humanizeDuration(definition.delay, { language: 'fr', round: true });
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={'Synchronisation en cours'} subheader={`Dernier document intégré il y a ${delay}`} />
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
