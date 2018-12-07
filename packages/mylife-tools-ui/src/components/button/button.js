'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { primary, disabled, ...otherProps } = this.props;
    return (
      <button disabled={disabled} className={classNames({ primary, secondary: !primary })} {...otherProps} />
    );
  }
}

Button.propTypes = {
  primary: PropTypes.bool,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  primary: false,
  disabled: false
};

export default Button;