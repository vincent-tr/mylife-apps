'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { showDialog } from './clean-others-dialog/dialog';

const CleanOthersCard = ({ definition, ...props }) => {
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={'Documents \'autres\''} subheader={`${definition.count} documents à nettoyer`} />
      <mui.CardContent />
      <mui.CardActions>
        <mui.Button size='small' onClick={showDialog}>Nettoyer</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

CleanOthersCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanOthersCard;
