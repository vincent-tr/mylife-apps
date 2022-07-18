'use strict';

import { useSelector, services } from 'mylife-tools-ui';
import { getSlideshow } from '../selectors';

const useConnect = () => useSelector(state => ({
  slideshow: getSlideshow(state)
}));

const SlideshowTitle = () => {
  const { slideshow } = useConnect();
  const title = slideshow ? services.renderObject(slideshow) : '<inconnu>';
  return <>{`Diaporama ${title}`}</>;
};

export default SlideshowTitle;
