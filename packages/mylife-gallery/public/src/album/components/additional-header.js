'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';

const AlbumAdditionalHeader = () => (
  <mui.IconButton color='inherit' onClick={() => console.log('on detail')}>
    <icons.actions.Detail />
  </mui.IconButton>
);

export default AlbumAdditionalHeader;
