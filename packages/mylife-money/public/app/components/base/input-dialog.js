import React from 'react';
import * as mui from 'material-ui';
import { confirmable, createConfirmation } from 'react-confirm';
import base from '../base/index';

class InputDialog extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      text: props && props.options && props.options.text
    };
  }

  componentWillReceiveProps(nextProps) {
    const { text } = nextProps.options;
    this.setState({ text });
  }

  render() {
    const { show, proceed, /*dismiss,*/ cancel, /*confirmation,*/ options } = this.props;
    const { text } = this.state;
    return (
      <base.Theme>
        <mui.Dialog
          title={options.title}
          actions={<div>
                    <mui.FlatButton
                      label="OK"
                      onTouchTap={() => proceed(text)} />
                    <mui.FlatButton
                      label="Annuler"
                      onTouchTap={() => cancel()} />
                  </div>}
          modal={true}
          open={show}
          autoScrollBodyContent={true}>
          <mui.TextField
            floatingLabelText={options.label}
            id="text"
            value={text || ''}
            onChange={(event) => this.setState({ text: event.target.value })}
          />
        </mui.Dialog>
      </base.Theme>
    );
  }
}

InputDialog.propTypes = {
  show: React.PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: React.PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: React.PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: React.PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: React.PropTypes.string,  // arguments of your confirm function
  options: React.PropTypes.object        // arguments of your confirm function
};

const edit = createConfirmation(confirmable(InputDialog));

export default ({ title, label, text, ...options }) => {
  edit({ options: { title, label, text } }).then(
    (text) => (options.proceed && options.proceed(text)),
    () => (options.cancel && options.cancel()));
};
