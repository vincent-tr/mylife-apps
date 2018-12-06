'use strict';

import React from 'react';
import PropTypes from 'prop-types';

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
  primary: PropTypes.bool
};

Button.defaultProps = {
  primary: false
};

export default Button;