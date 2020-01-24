'use strict';

import { useSelector } from 'mylife-tools-ui';
import { getSlideshow } from '../selectors';
import { renderObject } from '../../common/metadata-utils';

const useConnect = () => useSelector(state => ({
  slideshow: getSlideshow(state)
}));

const SlideshowTitle = () => {
  const { slideshow } = useConnect();
  const title = slideshow ? renderObject(slideshow) : '<inconnu>';
  return `Diaporama ${title}`;
};

export default SlideshowTitle;
