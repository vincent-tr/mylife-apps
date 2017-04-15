'use strict';

import { connect } from 'react-redux';
import { clearInfo } from '../actions/common';

import Tab from '../components/reference/tab';

const mapStateToProps = () => {
  return () => ({
    list : []
  });
};

const mapDispatchToProps = (dispatch) => ({
  onCreate : () => {}
  onUpdate : () => {},
});

const ReferenceTab = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab);

export default ReferenceTab;
