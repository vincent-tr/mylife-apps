'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import { createAlbum } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    createAlbum : (root) => dispatch(createAlbum(root))
  }), [dispatch]);
};

const AlbumCreationCard = ({ definition, ...props }) => {
  const { createAlbum } = useConnect();
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={definition.root} subheader={`${definition.count} documents dans cet album`} />
      <mui.CardContent />
      <mui.CardActions>
        <mui.Button size='small' onClick={() => createAlbum(definition.root)}>{'Créer l\'album'}</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

AlbumCreationCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default AlbumCreationCard;
