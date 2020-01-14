'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  }
});

const Footer = ({ size, className, ...props }) => {
  const classes = useStyles();
  return (
    <mui.Toolbar className={clsx(classes.toolbar, className)} {...props}>
      <mui.Typography>{`${size} albums(s)`}</mui.Typography>
    </mui.Toolbar>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired
};

export default Footer;
