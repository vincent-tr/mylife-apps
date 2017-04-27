'use strict';

import { connect } from 'react-redux';
import { getCapacity, getDish, getRegion, getType } from '../../selectors/references';
import { clearError } from '../../actions/common';

import Details from '../../components/reference/details';

function getItem(state, type, value) {
  switch(type) {
    case 'capacities' : return getCapacity(state, { value });
    case 'dishes'     : return getDish(state, { value });
    case 'regions'    : return getRegion(state, { value });
    case 'types'      : return getType(state, { value });
    default           : throw new Error('invalid type');
  }
}

const mapStateToProps = (state, { type, value }) => ({
  item : getItem(state, type, value)
});

const mapDispatchToProps = (dispatch, { type, value }) => ({
  onCreate : (item) => dispatch(clearError()),
  onUpdate : (item) => dispatch(clearError()),
  onDelete : (item) => dispatch(clearError())
});

const DetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);

export default DetailsContainer;
