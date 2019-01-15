'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const SvgIcon = ({ as: As, ...props }) => (
  <As className='svg-icon' draggable={false} {...props} />
);

SvgIcon.propTypes = {
  as: PropTypes.func.isRequired
};

export default SvgIcon;