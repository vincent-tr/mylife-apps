'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
//import { showDialog } from './dialogs/clean-others-dialog';
import CardBase from './card-base';

const CleanEmptyAlbumCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={definition.title}
      description={'Album vide'}
      actions={
        <mui.Button size='small' onClick={() => console.log('showDialog')}>{'Supprimer l\'album'}</mui.Button>
      }
      {...props}
    />
  );
};

CleanEmptyAlbumCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanEmptyAlbumCard;
