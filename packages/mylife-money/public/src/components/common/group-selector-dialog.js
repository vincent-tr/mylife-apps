import { React, PropTypes, mui, confirmable, createConfirmation } from 'mylife-tools-ui';
import base from '../base/index';
import GroupSelectorTree from './group-selector-tree';

const SelectorDialog = ({ show, proceed, /*dismiss,*/ cancel, /*confirmation, options*/ }) => (
  <base.Theme>
    <base.StoreProvider>
      <mui.Dialog
        title={'selectionnez un groupe'}
        actions={<div>
                  <mui.Button onClick={() => cancel()} >Annuler</mui.Button>
                </div>}
        modal={true}
        open={show}
        autoScrollBodyContent={true}>
        <GroupSelectorTreeContainer onSelect={proceed} />
      </mui.Dialog>
    </base.StoreProvider>
  </base.Theme>
);

SelectorDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
};

const edit = createConfirmation(confirmable(SelectorDialog));

export default (options) => {
  edit().then(
    (group) => (options.proceed && options.proceed(group)),
    () => (options.cancel && options.cancel()));
};
