import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import { confirmable, createConfirmation } from 'react-confirm';
import base from '../base/index';
import GroupMoveTreeContainer from '../../containers/management/group-move-tree-container.js';

const MoveDialog = ({ show, proceed, /*dismiss,*/ cancel, /*confirmation, options*/ }) => (
  <base.Theme>
    <base.StoreProvider>
      <mui.Dialog
        title={'selectionnez un groupe cible'}
        actions={<div>
                  <mui.FlatButton
                    label="Annuler"
                    onTouchTap={() => cancel()} />
                </div>}
        modal={true}
        open={show}
        autoScrollBodyContent={true}>
        <GroupMoveTreeContainer onSelect={proceed} />
      </mui.Dialog>
    </base.StoreProvider>
  </base.Theme>
);

MoveDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
};

const edit = createConfirmation(confirmable(MoveDialog));

export default (options) => {
  edit().then(
    (group) => (options.proceed && options.proceed(group)),
    () => (options.cancel && options.cancel()));
};
