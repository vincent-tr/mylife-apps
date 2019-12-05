'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';


const NULL_ID = 'null-id';

const SortFieldSelector = ({ list, value, onChange, ...props }) => {
  const handleChange = event => onChange(nullFromEditor(event.target.value));
  return (
    <Select
      value={value || NULL_ID}
      onChange={handleChange}
      {...props}
    >
      {list.map(field => (
        <MenuItem key={field.id || NULL_ID} value={field.id || NULL_ID}>{field.text}</MenuItem>
      ))}
    </Select>
  );
};

SortFieldSelector.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id   : PropTypes.string,
      text : PropTypes.string.isRequired
    }).isRequired
  ),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SortFieldSelector;

function nullFromEditor(value) {
  if(value === NULL_ID) {
    return null;
  }

  return value;
}
