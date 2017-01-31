import React from 'react';
import * as mui from 'material-ui';
import { confirmable, createConfirmation } from 'react-confirm';

const ConfirmDialog = ({ show, proceed, dismiss, cancel, confirmation, options }) => (
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
);

ConfirmDialog.propTypes = {
  show: React.PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: React.PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: React.PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: React.PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: React.PropTypes.string,  // arguments of your confirm function
  options: React.PropTypes.object        // arguments of your confirm function
};

const confirm = createConfirmation(confirmable(ConfirmDialog));

export default (lines, title, done) =>
  confirm({ options: { lines, title }}).then(
    () => done(null, true),
    () => done(null, false));
