'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import BaseMulti from './base-multi';

const ThumbnailAlbum = ({ album, ...props }) => (
  <BaseMulti thumbnails={album.thumbnails} {...props} />
);

ThumbnailAlbum.propTypes = {
  album: PropTypes.object.isRequired,
};

export default ThumbnailAlbum;
