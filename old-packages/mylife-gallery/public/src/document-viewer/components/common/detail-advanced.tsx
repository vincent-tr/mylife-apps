'use strict';

import { React, PropTypes, mui, useState } from 'mylife-tools-ui';

const ImageDetail = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(value => !value);
  };

  return (
    <>
      <mui.ListItem button onClick={handleClick}>
        <mui.ListItemText primary='Avancé' />
        {open ? <mui.icons.ExpandLess /> : <mui.icons.ExpandMore />}
      </mui.ListItem>
      <mui.Collapse in={open} timeout="auto" unmountOnExit>
        <mui.List component="div" disablePadding>
          {children}
        </mui.List>
      </mui.Collapse>
    </>
  );
};

ImageDetail.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default ImageDetail;
