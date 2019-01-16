'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SvgIcon = ({ as: As, className, ...props }) => (
  <As className={classNames('svg-icon', className)} draggable={false} {...props} />
);

SvgIcon.propTypes = {
  as: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default SvgIcon;