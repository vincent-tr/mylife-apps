'use strict';

import { React, PropTypes, mui, immutable } from 'mylife-tools-ui';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_MAP } from '../../common/document-type';

const emptySelectorValue = DOCUMENT_TYPES.map(type => type.id);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TypeSelector = ({ value, onChange, ...props }) => {
  const handleChange = event => onChange(valueFromSelector(event.target.value));
  const selectorValue = valueToSelector(value);
  return (
    <mui.Select
      multiple
      value={selectorValue}
      onChange={handleChange}
      input={<mui.Input />}
      renderValue={renderSelectorValue}
      MenuProps={MenuProps}
      {...props}
    >
      {DOCUMENT_TYPES.map(type => (
        <mui.MenuItem key={type.id} value={type.id}>
          <mui.Checkbox checked={selectorValue === emptySelectorValue || value.has(type.id)} />
          <mui.ListItemText primary={type.text} />
        </mui.MenuItem>
      ))}
    </mui.Select>
  );
};

TypeSelector.propTypes = {
  value: PropTypes.instanceOf(immutable.Set).isRequired,
  onChange: PropTypes.func.isRequired
};

export default TypeSelector;

function valueToSelector(value) {
  if(value.size === 0) {
    return emptySelectorValue;
  }

  return value.toArray();
}

function valueFromSelector(value) {
  if(value.length === emptySelectorValue.length) {
    return new immutable.Set();
  }

  return new immutable.Set(value);
}

function renderSelectorValue(selection) {
  if(selection === emptySelectorValue) {
    return '';
  }
  return selection.map(typeId => DOCUMENT_TYPE_MAP.get(typeId)).join(', ');
}
