import React from 'react';
import * as mui from 'material-ui';
import { confirmable, createConfirmation } from 'react-confirm';
import base from '../base/index';

class EditorDialog extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = { group: props && props.options && props.options.group };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      group: nextProps.options.group
    });
  }

  render() {
    const { show, proceed, /*dismiss,*/ cancel, /*confirmation, options*/ } = this.props;
    const { group } = this.state;
    return (
      <base.Theme>
        <mui.Dialog
          title="Editer le groupe"
          actions={<div>
                    <mui.FlatButton
                      label="OK"
                      onTouchTap={() => proceed(group)} />
                    <mui.FlatButton
                      label="Annuler"
                      onTouchTap={() => cancel()} />
                  </div>}
          modal={true}
          open={show}
          autoScrollBodyContent={true}>
          <div>
            <mui.TextField
              id="display"
              value={group.display}
              onChange={(event) => this.setState({ group: { ...group, display: event.target.value }})}
            />
          </div>
        </mui.Dialog>
      </base.Theme>
    );
  }
}

EditorDialog.propTypes = {
  show: React.PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: React.PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: React.PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: React.PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: React.PropTypes.string,  // arguments of your confirm function
  options: React.PropTypes.object        // arguments of your confirm function
};

const edit = createConfirmation(confirmable(EditorDialog));

export default (group, done) => {
  group = JSON.parse(JSON.stringify(group));
  edit({ options: { group } }).then(
    (group) => (done(null, group)),
    () => {});
};
