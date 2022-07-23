'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { showDialog } from './dialogs/delete-loading-errors-dialog';
import CardBase from './card-base';

const DeleteLoadingErrorsCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Documents en erreur'}
      description={`${definition.count} documents à ré-intégrer`}
      actions={
        <mui.Button size='small' onClick={showDialog}>Ré-intégrer</mui.Button>
      }
      {...props}
    />
  );
};

DeleteLoadingErrorsCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default DeleteLoadingErrorsCard;
