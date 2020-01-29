'use strict';

import { React, PropTypes, immutable, mui, useState } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import icons from '../../common/icons';
import HeaderObjects from './header-objects';

const useStyles = mui.makeStyles(theme => ({
  addButton: {
    color: theme.palette.success.main
  }
}));

const ENTER_KEY = 13;

const NewAlbum = ({ onNew }) => {
  const classes = useStyles();
  const [name, setName] = useState('');

  const onValidate = () => {
    if(!name) {
      return;
    }

    onNew({ name });
    setName('');
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      onValidate();
    }
  };

  return (
    <mui.ListItem>

      <mui.ListItemText primary={
        <mui.TextField
          fullWidth
          placeholder={'Nouvel album...'}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      } />

      <mui.ListItemSecondaryAction>
        <mui.IconButton edge='end' className={classes.addButton} onClick={onValidate} disabled={!name}>
          <mui.icons.AddCircle />
        </mui.IconButton>
      </mui.ListItemSecondaryAction>

    </mui.ListItem>
  );
};

NewAlbum.propTypes = {
  onNew: PropTypes.func.isRequired
};

const HeaderAlbums = ({ documents }) => {
  const { albums } = useAlbumView();
  const onSave = (newAlbums, initialAlbumUsage, albumUsage) => {
    console.log('onSave', newAlbums, initialAlbumUsage, albumUsage);
  };

  return (
    <HeaderObjects
      title={'Albums'}
      icon={<icons.menu.Album />}
      newObject={NewAlbum}
      newObjectRenderer={({ name }) => name}
      documents={documents}
      objects={albums}
      onSave={onSave}
      getObjectUsage={getInitialAlbumUsage}
    />
  );
};

HeaderAlbums.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderAlbums;

function getInitialAlbumUsage(documents) {
  const albums = new Map();
  for(const { info, document } of documents) {
    for(const { id: albumId } of info.albums) {
      let documents = albums.get(albumId);
      if(!documents) {
        documents = new Set();
        albums.set(albumId, documents);
      }

      documents.add(document);
    }
  }
  const entries = Array.from(albums.entries());
  const setEntries = entries.map(([albumId, documents]) => [albumId, new immutable.Set(documents)]);
  return new immutable.Map(setEntries);
}
