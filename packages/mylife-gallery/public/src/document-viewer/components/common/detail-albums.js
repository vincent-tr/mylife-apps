'use strict';

import { React, PropTypes, useMemo, useDispatch, dialogs } from 'mylife-tools-ui';
import { useAlbumView } from '../../../common/album-view';
import DetailList from './detail-list';
import { addDocumentToAlbum, removeDocumentFromAlbum, createAlbumWithDocument } from '../../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    createAlbum: (document, title) => dispatch(createAlbumWithDocument(document, title)),
    addAlbum : (document, album) => dispatch(addDocumentToAlbum(document, album)),
    removeAlbum : (document, album) => dispatch(removeDocumentFromAlbum(document, album)),
  }), [dispatch]);
};

const DetailAlbums = ({ documentWithInfo }) => {
  const { albums, albumView } = useAlbumView();
  const { addAlbum, removeAlbum, createAlbum } = useConnect();

  const { document, info } = documentWithInfo;
  const albumIds = info.albums.map(item => item.id);

  const addableAlbums = useMemo(() => {
    // the same document cannot be added twice in an album
    const idSet = new Set(albumIds);
    return albums.filter(album => !idSet.has(album._id));
  }, [albumIds, albums]);

  const onNew = async () => {
    const { result, text: title } = await dialogs.input({ title: 'Titre du nouvel album', label: 'Titre' });
    if(result !== 'ok') {
      return;
    }

    createAlbum(document, title);
  };

  return (
    <DetailList
      title={'Albums'}
      addTooltip={'Ajouter le document à un album'}
      newTooltip={'Nouvel album ...'}
      deleteTooltip={'Enlever le document de l\'album'}
      onAdd={album => addAlbum(document, album)}
      onNew={onNew}
      onDelete={album => removeAlbum(document, album)}
      items={albumIds.map(id => albumView.get(id))}
      addableItems={addableAlbums}
    />
  );
};

DetailAlbums.propTypes = {
  documentWithInfo: PropTypes.object.isRequired
};

export default DetailAlbums;
