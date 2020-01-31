'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
//import { showDialog } from './dialogs/clean-others-dialog';
import CardBase from './card-base';

const CleanEmptyAlbumCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Album vide'}
      description={`${definition.title} à supprimer`}
      actions={
        <mui.Button size='small' onClick={() => console.log('showDialog')}>Nettoyer</mui.Button>
      }
      {...props}
    />
  );
};

CleanEmptyAlbumCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanEmptyAlbumCard;
