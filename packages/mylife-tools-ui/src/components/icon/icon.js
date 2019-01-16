'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Icon = ({ className, ...props }) => (
  <img className={classNames('icon', className)} draggable={false} {...props} />
);

Icon.propTypes = {
  className: PropTypes.string
};

export default Icon;