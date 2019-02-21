'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './tools.scss';

const Box = React.forwardRef(({ stretch, className, children, ...props }, ref) => (
  <div ref={ref} className={classNames('container-box', className, { stretch })} {...props}>
    {children}
  </div>
));

Box.propTypes = {
  stretch: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

Box.defaultProps = {
  stretch: true
};

const Content = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={classNames('container-content', className)} {...props}>
    {children}
  </div>
));

Content.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export { Box, Content };
