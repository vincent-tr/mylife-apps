import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';

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
      <mui.Dialog
        title={options.title}
        actions={<div>
                  <mui.Button onClick={() => proceed(text)}>OK</mui.Button>
                  <mui.Button onClick={() => cancel()}>Annuler</mui.Button>
                </div>}
        modal={true}
        open={show}>
        <mui.TextField
          label={options.label}
          id="text"
          value={text || ''}
          onChange={(event) => this.setState({ text: event.target.value })}
        />
      </mui.Dialog>
    );
  }
}

InputDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
};

const edit = dialogs.create(InputDialog);

export default ({ title, label, text, ...options }) => {
  edit({ options: { title, label, text } }).then(
    (text) => (options.proceed && options.proceed(text)),
    () => (options.cancel && options.cancel()));
};
