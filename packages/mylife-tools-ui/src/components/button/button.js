'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = React.forwardRef(({ primary, disabled, ...otherProps }, ref) => (
  <button ref={ref} disabled={disabled} className={classNames({ primary, secondary: !primary })} {...otherProps} />
));

Button.propTypes = {
  primary: PropTypes.bool,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  primary: false,
  disabled: false
};

export default Button;