'use strict';

import React                     from 'react';
import PropTypes                 from 'prop-types';
import { connect }               from 'react-redux';
import { Button, Header, Modal } from 'semantic-ui-react';
import { getError }              from '../../selectors/dialogs';
import { clearError }            from '../../actions/dialogs';

const DialogError = ({ error, onClose }) => (
  <Modal open={!!error} onClose={onClose}>
    <Header icon='remove circle' content='Error' />
    <Modal.Content>
      <h3>{error && error.toString()}</h3>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose} primary>OK</Button>
    </Modal.Actions>
  </Modal>
);

DialogError.propTypes = {
  error   : PropTypes.object,
  onClose : PropTypes.func.isRequired
};

const mapStateToProps = () => {
  return (state) => ({
    error : getError(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  onClose : () => dispatch(clearError()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogError);
