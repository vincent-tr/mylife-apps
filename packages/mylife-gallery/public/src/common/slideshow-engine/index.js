'use strict';

import { useEffect, useState } from 'react';
import { useSlideshowImageView } from '../slideshow-image-view';
import { SlideshowEngine } from './slideshow-engine';
import { createOrchestrator } from './orchestrators';

const thumbnailMediaAccessor = slideshowImage => `/content/thumbnail/${slideshowImage.thumbnail}`;
const mediaMediaAccessor = slideshowImage => `/content/image/${slideshowImage.media}`;

// avoid to have mutable mediaAccessor parameter
export function useSlideshowEngineMedia(slideshow) {
  return useSlideshowEngine(slideshow, mediaMediaAccessor);
}

export function useSlideshowEngineThumbnail(slideshow) {
  return useSlideshowEngine(slideshow, thumbnailMediaAccessor);
}

function useSlideshowEngine(slideshow, mediaAccessor) {
  const { slideshowImages } = useSlideshowImageView(slideshow._id);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if(!slideshow || !slideshowImages || !slideshowImages.size) {
      return;
    }

    const orchestrator = createOrchestrator(slideshow);
    const engine = new SlideshowEngine(slideshow, slideshowImages, setUrl, mediaAccessor, orchestrator);

    return () => engine.close();
  }, [slideshow, slideshowImages]);

  return url;
}
