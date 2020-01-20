'use strict';

import { React, PropTypes, mui, immutable } from 'mylife-tools-ui';
import { usePersonView } from '../../common/person-view';
import { renderObject } from '../../common/metadata-utils';

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
  const { persons, personView } = usePersonView();
  const handleChange = event => onChange(new immutable.Set(event.target.value));
  const selectorValue = value.toArray();
  const renderSelectorValue = createSelectorValueRenderer(personView);

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
          <mui.ListItemText primary={renderObject(person)} />
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

function createSelectorValueRenderer(personView) {
  return selection => selection.map(personId => renderObject(personView.get(personId))).join(', ');
}
