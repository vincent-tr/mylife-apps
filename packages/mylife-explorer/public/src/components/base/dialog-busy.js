'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';
import { Modal }   from 'semantic-ui-react';
import { isBusy }  from '../../selectors/dialogs';

const DialogBusy = ({ show }) => (
  <Modal open={show} closeOnDimmerClick={false} size='mini'>
    <Modal.Content>
      <h5>Veuillez patienter ...</h5>
    </Modal.Content>
  </Modal>
);

DialogBusy.propTypes = {
  show : PropTypes.bool.isRequired
};

const mapStateToProps = () => {
  return (state) => ({
    show : isBusy(state)
  });
};

export default connect(
  mapStateToProps,
  null
)(DialogBusy);

