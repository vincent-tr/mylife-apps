'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, routing } from 'mylife-tools-ui';
import { browseWithCriteria } from '../actions';
import CardBase from './card-base';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    browseWithCriteria : (criteria) => dispatch(browseWithCriteria(criteria))
  }), [dispatch]);
};

const DocumentsWithoutAlbumCard = ({ definition, ...props }) => {
  const { browseWithCriteria } = useConnect();
  const { navigate } = routing.useRoutingConnect();

  const onBrowse = () => {
    browseWithCriteria({ noAlbum: true });
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
