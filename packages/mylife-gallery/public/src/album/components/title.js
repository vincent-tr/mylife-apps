'use strict';

import { useSelector } from 'mylife-tools-ui';
import { getAlbum } from '../selectors';
import { renderObject } from '../../common/metadata-utils';
import { useIsSmallScreen } from './behaviors';

const useConnect = () => useSelector(state => ({
  album: getAlbum(state)
}));

const AlbumTitle = () => {
  const { album } = useConnect();
  const isSmallScreen = useIsSmallScreen();

  if(isSmallScreen) {
    return 'Album';
  }

  const title = album ? renderObject(album) : '<inconnu>';
  return `Album ${title}`;
};

export default AlbumTitle;
