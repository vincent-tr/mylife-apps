'use strict';

import { connect } from 'react-redux';
import { clearInfo } from '../actions/common';

import DialogInfo from '../components/dialog-info';

const mapStateToProps = () => {
  return (state) => ({
    info : state.info
  });
};


const mapDispatchToProps = (dispatch) => ({
  onClose : () => dispatch(clearInfo()),
});

const DialogInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogInfo);

export default DialogInfoContainer;
