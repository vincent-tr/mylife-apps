'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './button.scss';

const Button = React.forwardRef(({ primary, disabled, className, ...otherProps }, ref) => (
  <button ref={ref} disabled={disabled} className={classNames('button', { primary, secondary: !primary }, className)} {...otherProps} />
));

Button.propTypes = {
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  primary: false,
  disabled: false
};

export default Button;
