'use strict';

import React from 'react';
import Dialog from './dialog';
import { ErrorSvg } from '../../../components';
import { getError } from '../selectors';
import { errorClear } from '../actions';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => ({
    error : getError(state),
  }),
  (dispatch) => ({
    clear : () => dispatch(errorClear())
  })
);

const Error = () => {
  const { error, clear } = useConnect();
  return (
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
};

export default Error;
