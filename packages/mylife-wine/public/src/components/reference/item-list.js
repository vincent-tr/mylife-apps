'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import base from '../base/index';

function title(type, item) {
  if(type === 'capacities') {
    return `${item.name} (${item.value} L)`;
  }
  return item.name;
}

const ItemList = ({ type, list, value, onChange }) => (
  <base.SelectableList selectedNode={{value}}
            selectedValueChanged={(obj) => onChange(obj.value)}>
    {list.map(item => (
      <base.SelectableListItem
        key={item.id}
        value={{ value: item.id }}
        leftIcon={<base.DataImage data={item.icon} />}
        primaryText={title(type, item)}/>
    ))}
  </base.SelectableList>
);

ItemList.propTypes = {
  type     : PropTypes.string.isRequired,
  list     : PropTypes.arrayOf(PropTypes.object),
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired
};

export default ItemList;
