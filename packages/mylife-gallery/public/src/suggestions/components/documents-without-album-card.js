'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, routing } from 'mylife-tools-ui';
import { browseDocumentsWithoutAlbum } from '../actions';
import CardBase from './card-base';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    browseDocumentsWithoutAlbum : () => dispatch(browseDocumentsWithoutAlbum())
  }), [dispatch]);
};

const DocumentsWithoutAlbumCard = ({ definition, ...props }) => {
  const { browseDocumentsWithoutAlbum } = useConnect();
  const { navigate } = routing.useRoutingConnect();

  const onBrowse = () => {
    browseDocumentsWithoutAlbum();
    navigate('/browse');
  };

  return (
    <CardBase
      title={'Documents sans albums'}
      description={`${definition.count} documents à trier`}
      actions={
        <mui.Button size='small' onClick={onBrowse}>Parcourir</mui.Button>
      }
      {...props}
    />
  );
};

DocumentsWithoutAlbumCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default DocumentsWithoutAlbumCard;
