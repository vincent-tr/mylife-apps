'use strict';

import React from 'react';
import propTypes from 'prop-types';
import './button.scss';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { primary, ...otherProps } = this.props;
    return (
      <button className={primary ? 'primary' : 'secondary' } {...otherProps} />
    );
  }
}

Button.propTypes = {
  primary: propTypes.bool
};

Button.defaultProps = {
  primary: false
};

export default Button;