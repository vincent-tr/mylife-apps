'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class IndeterminableCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.checkboxRef = React.createRef();
  }

  componentDidMount() {
    this._updateIndeterminate();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.indeterminate !== this.props.indeterminate) {
      this._updateIndeterminate();
    }
  }

  render() {
    const { indeterminate, ... props } = this.props;
    void indeterminate;
    return (
      <input type='checkbox' ref={this.checkboxRef} { ...props } />
    );
  }

  _updateIndeterminate() {
    this.checkboxRef.current.indeterminate = this.props.indeterminate;
  }
}

IndeterminableCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

IndeterminableCheckbox.defaultProps = {
  indeterminate: false
};

export default IndeterminableCheckbox;
