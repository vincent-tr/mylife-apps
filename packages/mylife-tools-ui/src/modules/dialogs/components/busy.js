'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from './dialog';
import { Spinner } from '../../../components';
import { getBusy } from '../selectors';

const Busy = ({ busy }) => (
  <Dialog open={busy} className='dialog-busy'>
    <Spinner className='busy-icon' />
    <span className='busy-text'>Traitement en cours ...</span>
  </Dialog>
);

Busy.propTypes = {
  busy: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  busy : getBusy(state),
});

const mapDispatchToProps = (/*dispatch*/) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Busy);
