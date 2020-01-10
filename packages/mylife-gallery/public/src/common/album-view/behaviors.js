'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refAlbumView, unrefAlbumView } from './actions';
import { getAlbumView, getAlbums } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      albumView: getAlbumView(state),
      albums: getAlbums(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refAlbumView()),
      leave: () => dispatch(unrefAlbumView())
    }), [dispatch])
  };
};

export function useAlbumView() {
  const { enter, leave, albums, albumView } = useConnect();
  useLifecycle(enter, leave);
  return { albums, albumView };
}
