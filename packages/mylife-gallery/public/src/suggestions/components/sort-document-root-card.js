'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
//import { showDialog } from './dialogs/clean-others-dialog';
import CardBase from './card-base';

const SortDocumentRootCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'TODO'}
      description={JSON.stringify(definition)}
      actions={
        <mui.Button size='small' onClick={() => console.log('showDialog')}>TODO</mui.Button>
      }
      {...props}
    />
  );
};

SortDocumentRootCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default SortDocumentRootCard;
