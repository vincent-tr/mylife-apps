'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from './dialog';
import { getError } from '../selectors';
import { errorClear } from '../actions';

const Error = ({ error, clear }) => (
  <Dialog
    open={!!error}
    onClose={clear}
    title={<h3>Error</h3>}
    actions={[
      { closeValue: 'ok', content: 'Ok', primary: true, shortcuts: [ 'esc' ] }
    ]}>
    {error && error.toString()}
  </Dialog>
);

Error.propTypes = {
  error: PropTypes.object,
  clear: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error : getError(state),
});

const mapDispatchToProps = (dispatch) => ({
  clear : () => dispatch(errorClear())
});

export default connect(mapStateToProps, mapDispatchToProps)(Error);
