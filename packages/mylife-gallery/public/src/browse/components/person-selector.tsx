'use strict';

import { React, PropTypes, mui, immutable, services } from 'mylife-tools-ui';
import { usePersonView } from '../../common/shared-views';

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

const PersonSelector = ({ value, onChange, ...props }) => {
  const { persons, view } = usePersonView();
  const handleChange = event => onChange(immutable.Set(event.target.value));
  const selectorValue = value.toArray();
  const renderSelectorValue = createSelectorValueRenderer(view);

  return (
    <mui.Select
      multiple
      value={selectorValue}
      onChange={handleChange}
      input={<mui.Input fullWidth />}
      renderValue={renderSelectorValue}
      MenuProps={MenuProps}
      {...props}
    >
      {persons.map(person => (
        <mui.MenuItem key={person._id} value={person._id}>
          <mui.Checkbox checked={value.has(person._id)} />
          <mui.ListItemText primary={services.renderObject(person)} />
        </mui.MenuItem>
      ))}
    </mui.Select>
  );
};

PersonSelector.propTypes = {
  value: PropTypes.instanceOf(immutable.Set).isRequired,
  onChange: PropTypes.func.isRequired
};

export default PersonSelector;

function createSelectorValueRenderer(view) {
  return selection => selection.map(personId => services.renderObject(view.get(personId))).join(', ');
}
