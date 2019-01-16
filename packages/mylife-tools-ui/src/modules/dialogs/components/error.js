'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from './dialog';
import { ErrorSvg } from '../../../components';
import { getError } from '../selectors';
import { errorClear } from '../actions';

const Error = ({ error, clear }) => (
  <Dialog
    titleClassName='dialog-title-error'
    open={!!error}
    onClose={clear}
    title={
      <React.Fragment>
        <ErrorSvg className='error-title-icon' />
        <h3 className='error-title-text'>Erreur</h3>
      </React.Fragment>
    }
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
