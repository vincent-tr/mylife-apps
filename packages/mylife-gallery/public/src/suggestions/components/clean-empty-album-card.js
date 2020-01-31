'use strict';

import { React, PropTypes, useDispatch, useMemo, DeleteButton } from 'mylife-tools-ui';
import { deleteEmptyAlbum } from '../actions';
import CardBase from './card-base';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    deleteEmptyAlbum : (id) => dispatch(deleteEmptyAlbum(id))
  }), [dispatch]);
};

const CleanEmptyAlbumCard = ({ definition, ...props }) => {
  const { deleteEmptyAlbum } = useConnect();
  return (
    <CardBase
      title={definition.title}
      description={'Album vide'}
      actions={
        <DeleteButton
          tooltip={'Supprimer l\'album'}
          icon
          text='Supprimer'
          confirmText={`Etes-vous sûr de vouloir supprimer l'album '${definition.title}' ?`}
          onConfirmed={() => deleteEmptyAlbum(definition.id)}
        />
      }
      {...props}
    />
  );
};

CleanEmptyAlbumCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanEmptyAlbumCard;
