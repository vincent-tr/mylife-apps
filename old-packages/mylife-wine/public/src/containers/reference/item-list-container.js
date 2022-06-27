'use strict';

import { connect } from 'react-redux';
import { getCapacities, getDishes, getRegions, getTypes } from '../../selectors/references';

import ItemList from '../../components/reference/item-list';

function getList(state, type) {
  switch(type) {
    case 'capacities' : return getCapacities(state);
    case 'dishes'     : return getDishes(state);
    case 'regions'    : return getRegions(state);
    case 'types'      : return getTypes(state);
    default           : throw new Error('invalid type');
  }
}

const mapStateToProps = (state, { type }) => ({
  list : getList(state, type)
});

const ItemListContainer = connect(
  mapStateToProps
)(ItemList);

export default ItemListContainer;
