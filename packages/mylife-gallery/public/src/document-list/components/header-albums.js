'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';

const HeaderAlbums = ({ documents }) => (
  <mui.Tooltip title={'Albums'}>
    <mui.IconButton>
      <icons.menu.Album />
    </mui.IconButton>
  </mui.Tooltip>
);

HeaderAlbums.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderAlbums;
