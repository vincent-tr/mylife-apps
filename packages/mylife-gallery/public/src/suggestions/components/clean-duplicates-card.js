'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { showDialog } from './dialogs/clean-duplicates-dialog';
import CardBase from './card-base';

const CleanDuplicatesCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Documents en doublons'}
      description={`${definition.count} documents à nettoyer`}
      actions={
        <mui.Button size='small' onClick={showDialog}>Créer un script</mui.Button>
      }
      {...props}
    />
  );
};

CleanDuplicatesCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanDuplicatesCard;
