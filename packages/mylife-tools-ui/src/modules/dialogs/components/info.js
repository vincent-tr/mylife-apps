'use strict';

import React from 'react';
import Dialog from './dialog';
import { InfoSvg } from '../../../components';
import { getInfo } from '../selectors';
import { infoClear } from '../actions';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => ({
    info : getInfo(state),
  }),
  (dispatch) => ({
    clear : () => dispatch(infoClear())
  })
);

const Info = () => {
  const { info, clear } = useConnect();
  return (
    <Dialog
      titleClassName='dialog-title-info'
      open={!!info}
      onClose={clear}
      title={
        <React.Fragment>
          <InfoSvg className='info-title-icon' />
          <h3 className='info-title-text'>Information</h3>
        </React.Fragment>
      }
      actions={[
        { closeValue: 'ok', content: 'Ok', primary: true, shortcuts: [ 'esc' ] }
      ]}>
      {info}
    </Dialog>
  );
};

export default Info;
