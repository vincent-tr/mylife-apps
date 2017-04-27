'use strict';

import { connect } from 'react-redux';
import { getCapacity, getDish, getRegion, getType } from '../../selectors/references';
import {
  createCapacity, createDish, createRegion, createType,
  updateCapacity, updateDish, updateRegion, updateType,
  deleteCapacity, deleteDish, deleteRegion, deleteType
} from '../../actions/references';

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

function createItem(type) {
  switch(type) {
    case 'capacities' : return createCapacity({ name: 'Nouveau', value: 0 });
    case 'dishes'     : return createDish({ name: 'Nouveau' });
    case 'regions'    : return createRegion({ name: 'Nouveau' });
    case 'types'      : return createType({ name: 'Nouveau' });
    default           : throw new Error('invalid type');
  }
}

function updateItem(type, item) {
  switch(type) {
    case 'capacities' : return updateCapacity(item);
    case 'dishes'     : return updateDish(item);
    case 'regions'    : return updateRegion(item);
    case 'types'      : return updateType(item);
    default           : throw new Error('invalid type');
  }
}

function deleteItem(type, id) {
  switch(type) {
    case 'capacities' : return deleteCapacity(id);
    case 'dishes'     : return deleteDish(id);
    case 'regions'    : return deleteRegion(id);
    case 'types'      : return deleteType(id);
    default           : throw new Error('invalid type');
  }
}

const mapStateToProps = (state, { type, value }) => ({
  item : getItem(state, type, value)
});

const mapDispatchToProps = (dispatch, { type }) => ({
  onCreate : () => dispatch(createItem(type)),
  onUpdate : (item) => dispatch(updateItem(type, item)),
  onDelete : (id) => dispatch(deleteItem(type, id))
});

const DetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);

export default DetailsContainer;
