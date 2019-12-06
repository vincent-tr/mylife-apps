'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const NavBar = ({ open, document, info, ...props }) => {
  if(!open) {
    return null;
  }

  return (
    <div {...props}>
      Detail
    </div>
  );
};

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default NavBar;
