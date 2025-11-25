import React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const NULL_ID = 'null-id';

const ListSelector = ({ list, value, onChange, ...props }) => {
  const handleChange = (event) => onChange(nullFromEditor(event.target.value));
  return (
    <Select value={value || NULL_ID} onChange={handleChange} {...props}>
      {list.map((field) => (
        <MenuItem key={field.id || NULL_ID} value={field.id || NULL_ID}>
          {field.text}
        </MenuItem>
      ))}
    </Select>
  );
};

ListSelector.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string.isRequired,
    }).isRequired
  ),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ListSelector;

function nullFromEditor(value) {
  if (value === NULL_ID) {
    return null;
  }

  return value;
}
