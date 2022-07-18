import { useSelector, services } from 'mylife-tools-ui';
import { getAlbum } from '../selectors';
import { useIsSmallScreen } from './behaviors';

const useConnect = () => useSelector(state => ({
  album: getAlbum(state)
}));

const AlbumTitle = () => {
  const { album } = useConnect();
  const isSmallScreen = useIsSmallScreen();

  if(isSmallScreen) {
    return <>Album</>;
  }

  const title = album ? services.renderObject(album) : '<inconnu>';
  return <>{`Album ${title}`}</>;
};

export default AlbumTitle;
