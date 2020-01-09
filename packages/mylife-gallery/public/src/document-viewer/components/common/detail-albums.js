'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField } from 'mylife-tools-ui';

const DetailAlbums = ({ document }) => {

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{'Albums'}</mui.Typography>
        }
        secondary={
          <DebouncedTextField value={''} onChange={() => {}} />
        } />
    </mui.ListItem>
  );
};

DetailAlbums.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailAlbums;
