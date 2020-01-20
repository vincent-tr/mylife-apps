'use strict';

import { React, PropTypes, mui, immutable } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
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

const AlbumSelector = ({ value, onChange, ...props }) => {
  const { albums, albumView } = useAlbumView();
  const handleChange = event => onChange(new immutable.Set(event.target.value));
  const selectorValue = value.toArray();
  const renderSelectorValue = createSelectorValueRenderer(albumView);

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
  value: PropTypes.instanceOf(immutable.Set).isRequired,
  onChange: PropTypes.func.isRequired
};

export default AlbumSelector;

function createSelectorValueRenderer(albumView) {
  return selection => selection.map(albumId => renderObject(albumView.get(albumId))).join(', ');
}
