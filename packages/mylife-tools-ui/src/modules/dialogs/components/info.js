'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from './dialog';
import { getInfo } from '../selectors';
import { infoClear } from '../actions';

// TODO: icon
const Info = ({ info, clear }) => (
  <Dialog
    open={!!info}
    onClose={clear}
    title={<h3>Information</h3>}
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
