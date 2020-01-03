'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const CleanDuplicatesCard = ({ definition }) => {
  return (
    <mui.Card>
      <mui.CardContent>
        <mui.Typography variant='h5' component='h2'>
          Nettoyer les documents en doublons
        </mui.Typography>
        <mui.Typography variant='body2' component='p'>
          {definition.count} documents à nettoyer
        </mui.Typography>
      </mui.CardContent>
      <mui.CardActions>
        <mui.Button size='small'>TODO</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

CleanDuplicatesCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanDuplicatesCard;
