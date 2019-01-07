'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as views from './views';
import { getView } from '../selectors/view';

const Dispatcher = ({ id }) => {
  const View = views[id];
  return (
    <View />
  );
};

Dispatcher.propTypes = {
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  id: getView(state),
});

const mapDispatchToProps = (/*dispatch*/) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Dispatcher);
