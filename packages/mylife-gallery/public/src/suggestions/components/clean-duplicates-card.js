'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const CleanDuplicatesCard = ({ definition, ...props }) => {
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={'Documents en doublons'} subheader={`${definition.count} documents à nettoyer`} />
      <mui.CardContent />
      <mui.CardActions>
        <mui.Button size='small'>Nettoyer</mui.Button>
      </mui.CardActions>
    </mui.Card>
  );
};

CleanDuplicatesCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanDuplicatesCard;
