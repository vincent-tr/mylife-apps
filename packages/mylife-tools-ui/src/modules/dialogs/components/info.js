'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from './dialog';
import { InfoSvg } from '../../../components';
import { getInfo } from '../selectors';
import { infoClear } from '../actions';

const Info = ({ info, clear }) => (
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

Info.propTypes = {
  info: PropTypes.string,
  clear: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  info : getInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  clear : () => dispatch(infoClear())
});

export default connect(mapStateToProps, mapDispatchToProps)(Info);
