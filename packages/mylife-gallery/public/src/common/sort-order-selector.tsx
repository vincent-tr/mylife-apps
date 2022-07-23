'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const orders = [
  { id: 'asc', text: 'Ascendant' },
  { id: 'desc', text: 'Descendant' }
];

const SortOrderSelector = ({ value, onChange, ...props }) => {
  const handleChange = event => onChange(event.target.value);
  return (
    <mui.RadioGroup
      value={value}
      onChange={handleChange}
      row
      {...props}
    >
      {orders.map(field => (
        <mui.FormControlLabel key={field.id} value={field.id} control={<mui.Radio />} label={field.text}/>
      ))}
    </mui.RadioGroup>
  );
};

SortOrderSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SortOrderSelector;
