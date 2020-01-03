'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const AlbumCreationCard = ({ definition, ...props }) => {
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={definition.root} subheader={`${definition.count} documents dans cet album`} />
      <mui.CardActions>
        <mui.Button size='small'>{'Créer l\'album'}</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

AlbumCreationCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default AlbumCreationCard;
