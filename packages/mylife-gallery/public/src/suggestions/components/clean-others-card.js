'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { showDialog } from './dialogs/clean-others-dialog';
import CardBase from './card-base';

const CleanOthersCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Documents \'autres\''}
      description={`${definition.count} documents à nettoyer`}
      actions={
        <mui.Button size='small' onClick={showDialog}>Nettoyer</mui.Button>
      }
      {...props}
    />
  );
};

CleanOthersCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanOthersCard;
