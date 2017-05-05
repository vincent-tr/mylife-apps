import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import { confirmable, createConfirmation } from 'react-confirm';
import Theme from './theme';

const ConfirmDialog = ({ show, proceed, /*dismiss,*/ cancel, /*confirmation,*/ options }) => (
  <Theme>
    <mui.Dialog
      title={options.title}
      actions={<div>
                <mui.FlatButton
                  label="Oui"
                  onTouchTap={() => proceed()} />
                <mui.FlatButton
                  label="Non"
                  onTouchTap={() => cancel()} />
              </div>}
      modal={true}
      open={show}
      autoScrollBodyContent={true}>
      <mui.List>
        {options.lines.map(it => (<mui.ListItem key={it} primaryText={it} />))}
      </mui.List>
    </mui.Dialog>
  </Theme>
);

ConfirmDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
};

const confirm = createConfirmation(confirmable(ConfirmDialog));

export default (options) => {
  options.title = options.title || 'Confirmation';
  options.lines = options.lines || ['Confirmer ?'];

  confirm({ options }).then(
    () => (options.proceed && options.proceed()),
    () => (options.cancel && options.cancel()));
};
