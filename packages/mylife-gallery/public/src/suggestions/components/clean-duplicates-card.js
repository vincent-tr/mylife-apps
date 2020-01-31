'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui, addLineBreaks } from 'mylife-tools-ui';
import { showDialog } from './dialogs/clean-duplicates-dialog';
import CardBase from './card-base';

const CleanDuplicatesCard = ({ definition, ...props }) => {
  return (
    <CardBase
      title={'Documents en doublons'}
      description={addLineBreaks([
        `${definition.count} documents à nettoyer`,
        `${humanize.filesize(definition.fileSizeSum)} place à récupérer`
      ])}
      actions={
        <mui.Button size='small' onClick={showDialog}>Créer un script</mui.Button>
      }
      {...props}
    />
  );
};

CleanDuplicatesCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default CleanDuplicatesCard;
