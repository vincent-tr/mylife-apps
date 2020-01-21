'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refSlideshowImageView, unrefSlideshowImageView } from './actions';
import { getSlideshowImageView } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      slideshowImageView: getSlideshowImageView(state)
    })),
    ...useMemo(() => ({
      ref: (slideshowId) => dispatch(refSlideshowImageView(slideshowId)),
      unref: (slideshowId) => dispatch(unrefSlideshowImageView(slideshowId))
    }), [dispatch])
  };
};

export function useSlideshowImageView(slideshowId) {
  const { ref, unref, slideshowImageView } = useConnect();
  useLifecycle(() => ref(slideshowId), () => unref(slideshowId));
  return { slideshowImageView };
}
