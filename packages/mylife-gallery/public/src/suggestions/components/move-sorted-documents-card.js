'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { showDialog } from './dialogs/move-sorted-documents-dialog';
import CardBase from './card-base';

const MoveSortedDocumentsCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={definition.title}
      description={`${definition.count} documents triés à déplacer`}
      actions={
        <mui.Button size='small' onClick={() => showDialog(definition)}>Créer un script</mui.Button>
      }
      {...props}
    />
  );
};

MoveSortedDocumentsCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default MoveSortedDocumentsCard;
