'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './button.scss';

const Button = React.forwardRef(({ primary, enabled, className, ...otherProps }, ref) => {
  delete otherProps.disabled; // use enabled instead
  return (
    <button ref={ref} disabled={!enabled} className={classNames('button', { primary, secondary: !primary }, className)} {...otherProps} />
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  primary: PropTypes.bool,
  enabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  primary: false,
  enabled: true
};

export default Button;
