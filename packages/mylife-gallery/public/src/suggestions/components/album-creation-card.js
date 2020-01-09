'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import { createAlbum } from '../actions';
import CardBase from './card-base';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    createAlbum : (root) => dispatch(createAlbum(root))
  }), [dispatch]);
};

const AlbumCreationCard = ({ definition, ...props }) => {
  const { createAlbum } = useConnect();
  return (
    <CardBase
      title={definition.root}
      description={`${definition.count} documents dans cet album`}
      actions={
        <mui.Button size='small' onClick={() => createAlbum(definition.root)}>
          {'Créer l\'album'}
        </mui.Button>
      }
      {...props}
    />
  );
};

AlbumCreationCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default AlbumCreationCard;
