'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refSlideshowImageView, unrefSlideshowImageView } from './actions';
import { getSlideshowImageView, getSlideshowImages } from './selectors';

const useConnect = (slideshowId) => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      slideshowImageView: getSlideshowImageView(state),
      slideshowImages: getSlideshowImages(state, slideshowId)
    })),
    ...useMemo(() => ({
      ref: (slideshowId) => dispatch(refSlideshowImageView(slideshowId)),
      unref: (slideshowId) => dispatch(unrefSlideshowImageView(slideshowId))
    }), [dispatch])
  };
};

export function useSlideshowImageView(slideshowId) {
  const { ref, unref, slideshowImageView, slideshowImages } = useConnect(slideshowId);
  useLifecycle(() => ref(slideshowId), () => unref(slideshowId));
  return { slideshowImageView, slideshowImages };
}
