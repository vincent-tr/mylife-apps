'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const AlbumCreationCard = ({ definition }) => {
  return (
    <mui.Card>
      <mui.CardContent>
        <mui.Typography variant='h5' component='h2'>
          {`Créer album '${definition.root}'`}
        </mui.Typography>
        <mui.Typography variant='body2' component='p'>
          {definition.count} documents dans cet album
        </mui.Typography>
      </mui.CardContent>
      <mui.CardActions>
        <mui.Button size='small'>TODO</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

AlbumCreationCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default AlbumCreationCard;
