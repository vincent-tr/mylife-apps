'use strict';

import { React, PropTypes, mui, immutable, useState, useMemo } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import icons from '../../common/icons';
import { renderObject } from '../../common/metadata-utils';

const MenuAlbums = ({ documents, anchorEl, handleClose }) => {
  const { albums, albumView } = useAlbumView();
  const albumIds = useMemo(() => getUsedAlbums(documents), [documents]);

  const addableAlbums = useMemo(() => {
    // the same document cannot be added twice in an album
    const idSet = new Set(albumIds);
    return albums.filter(album => !idSet.has(album._id));
  }, [albumIds, albums]);

  const onDelete = (album) => console.log('onDelete', album);

  return (
    <mui.Menu
      anchorEl={anchorEl}
      keepMounted
      open={!!anchorEl}
      onClose={handleClose}
    >
      {albumIds.map(albumId => {
        const album = albumView.get(albumId);
        if(!album) { // can happen if item view not ready
          return null;
        }

        return (
          <mui.MenuItem key={album._id} onClick={handleClose}>
            <mui.ListItemText primary={renderObject(album)} />
            <mui.ListItemSecondaryAction>
              <mui.Tooltip title={'Enlever les documents de l\'album'}>
                <mui.IconButton onClick={() => onDelete(album)}>
                  <mui.icons.Delete />
                </mui.IconButton>
              </mui.Tooltip>
            </mui.ListItemSecondaryAction>
          </mui.MenuItem>
        );
      })}
    </mui.Menu>
  );
};

const HeaderAlbums = ({ documents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <mui.Tooltip title={'Albums'}>
        <mui.IconButton onClick={e => setAnchorEl(e.target)}>
          <icons.menu.Album />
        </mui.IconButton>
      </mui.Tooltip>
      <MenuAlbums documents={documents} anchorEl={anchorEl} handleClose={handleClose} />
    </>
  );
};

HeaderAlbums.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderAlbums;

function getUsedAlbums(documents) {
  const set = new Set();
  for(const { info } of documents) {
    for(const id of info.albums) {
      set.add(id);
    }
  }
  return new immutable.Set(set);
}
