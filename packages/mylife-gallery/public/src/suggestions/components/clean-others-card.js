'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const CleanOthersCard = ({ definition, ...props }) => {
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={'Nettoyer les documents \'autres\''} subheader={`${definition.count} documents à nettoyer`} />
      <mui.CardActions>
        <mui.Button size='small'>Nettoyer</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

CleanOthersCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanOthersCard;
