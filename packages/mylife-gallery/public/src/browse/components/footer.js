'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  }
});

const Footer = ({ fullSize, displayedSize, className, ...props }) => {
  const classes = useStyles();
  const text = displayedSize === fullSize ? `${displayedSize} document(s)` : `${displayedSize} documents affichés sur ${fullSize}`;
  return (
    <mui.Toolbar className={clsx(classes.toolbar, className)} {...props}>
      <mui.Typography>{text}</mui.Typography>
    </mui.Toolbar>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  fullSize: PropTypes.number.isRequired,
  displayedSize: PropTypes.number.isRequired
};

export default Footer;
