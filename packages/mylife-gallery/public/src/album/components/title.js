'use strict';

import { React, useSelector } from 'mylife-tools-ui';
import { getAlbum } from '../selectors';

const useConnect = () => useSelector(state => ({
  album: getAlbum(state)
}));

const AlbumTitle = () => {
  const { album } = useConnect();
  const title = album && album.title || '<inconnu>';
  return `Album ${title}`;
};

export default AlbumTitle;
