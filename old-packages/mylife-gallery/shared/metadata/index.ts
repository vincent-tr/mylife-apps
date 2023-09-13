import datatypes from './datatypes';

import document from './entities/document';
import documentWithInfo from './entities/document-with-info';
import image from './entities/image';
import video from './entities/video';
import other from './entities/other';
import album from './entities/album';
import person from './entities/person';
import slideshow from './entities/slideshow';
import slideshowImage from './entities/slideshow-image';
import stat from './entities/stat';
import suggestion from './entities/suggestion';

export default {
  datatypes,
  entities: [
    document,
    documentWithInfo,
    image,
    video,
    other,
    album,
    person,
    slideshow,
    slideshowImage,
    stat,
    suggestion,
  ]
};
