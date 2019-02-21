'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './tools.scss';

const Box = ({ stretch, className, children }) => (
  <div className={classNames('container-box', className, { stretch })}>
    {children}
  </div>
);

Box.propTypes = {
  stretch: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

Box.defaultProps = {
  stretch: true
};

const Content = ({ className, children }) => (
  <div className={classNames('container-content', className)}>
    {children}
  </div>
);

Content.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export { Box, Content };
