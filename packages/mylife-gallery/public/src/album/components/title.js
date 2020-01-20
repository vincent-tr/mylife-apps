'use strict';

import { useSelector } from 'mylife-tools-ui';
import { getAlbum } from '../selectors';
import { renderObject } from '../../common/metadata-utils';

const useConnect = () => useSelector(state => ({
  album: getAlbum(state)
}));

const AlbumTitle = () => {
  const { album } = useConnect();
  const title = album ? renderObject(album) : '<inconnu>';
  return `Album ${title}`;
};

export default AlbumTitle;
