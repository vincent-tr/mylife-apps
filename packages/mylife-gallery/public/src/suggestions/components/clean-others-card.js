'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const CleanOthersCard = ({ definition }) => {
  return (
    <mui.Card>
      <mui.CardContent>
        <mui.Typography variant='h5' component='h2'>
          {'Nettoyer les documents \'autres\''}
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

CleanOthersCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanOthersCard;
