'use strict';

import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import { renderObject } from '../../common/metadata-utils';

const ThumbnailSelectorDialog = ({ options, show, proceed }) => {
  const { person } = options;

  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} scroll='paper' maxWidth='sm' fullWidth>
      <mui.DialogTitle id='dialog-title'>
        {`Sélectionner la miniature à utiliser pour '${renderObject(person)}'`}
      </mui.DialogTitle>

      <mui.DialogContent dividers>
        {'TODO'}
        <mui.Button color='primary' onClick={() => proceed({ result: 'ok', thumbnail: person.thumbnails[0] })}>OK</mui.Button>
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

ThumbnailSelectorDialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool,
  proceed: PropTypes.func
};

const showDialog = dialogs.create(ThumbnailSelectorDialog);

export const thumbnailSelectorDialog = async (person) => showDialog({ options: { person } });
