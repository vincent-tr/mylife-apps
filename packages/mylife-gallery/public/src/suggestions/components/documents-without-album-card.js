'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
//import { showDialog } from './dialogs/clean-others-dialog';
import CardBase from './card-base';

const DocumentsWithoutAlbumCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Documents sans albums'}
      description={`${definition.count} documents à trier`}
      actions={
        <mui.Button size='small' onClick={() => console.log('showDialog')}>Ré-intégrer</mui.Button>
      }
      {...props}
    />
  );
};

DocumentsWithoutAlbumCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default DocumentsWithoutAlbumCard;
