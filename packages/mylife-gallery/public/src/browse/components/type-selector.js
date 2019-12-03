import { React, PropTypes, mui, immutable } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

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

const types = [
  { id: 'image', text: 'Image' },
  { id: 'video', text: 'Vidéo' },
  { id: 'other', text: 'Autre' }
];

const TypeSelector = ({ value, onChange }) => {
  const classes = useStyles();
  const handleChange = event => onChange(new immutable.Set(event.target.value));
  return (
    <mui.Select
      multiple
      value={value.toArray()}
      onChange={handleChange}
      input={<mui.Input />}
      renderValue={selected => (
        <div className={classes.chips}>
          {selected.map(value => (
            <mui.Chip key={value} label={value} className={classes.chip} />
          ))}
        </div>
      )}
      MenuProps={MenuProps}
    >
      {types.map(type => (
        <mui.MenuItem key={type.id} value={type.id}>
          <mui.Checkbox checked={value.has(type.id)} />
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
