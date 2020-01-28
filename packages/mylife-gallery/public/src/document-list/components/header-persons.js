'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';

const HeaderPersons = ({ documents }) => (
  <mui.Tooltip title={'Personnes'}>
    <mui.IconButton>
      <icons.menu.Person />
    </mui.IconButton>
  </mui.Tooltip>
);

HeaderPersons.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderPersons;
