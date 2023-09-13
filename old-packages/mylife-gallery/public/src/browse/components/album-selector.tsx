'use strict';

import { React, PropTypes, mui, immutable, services } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/shared-views';

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

interface AlbumSelectorProps {
  value: immutable.Set<string>;
  onChange: (newValue: immutable.Set<string>) => void;
}

const AlbumSelector: React.FunctionComponent<AlbumSelectorProps> = ({ value, onChange, ...props }) => {
  const { albums, view } = useAlbumView();
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
      {albums.map(album => (
        <mui.MenuItem key={album._id} value={album._id}>
          <mui.Checkbox checked={value.has(album._id)} />
          <mui.ListItemText primary={album.title} />
        </mui.MenuItem>
      ))}
    </mui.Select>
  );
};

AlbumSelector.propTypes = {
  value: PropTypes.any.isRequired, // instanceOf(immutable.Set)
  onChange: PropTypes.func.isRequired
};

export default AlbumSelector;

function createSelectorValueRenderer(view) {
  return selection => selection.map(albumId => services.renderObject(view.get(albumId))).join(', ');
}
