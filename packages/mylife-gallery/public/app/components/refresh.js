'use strict';

import React             from 'react';
import PropTypes         from 'prop-types';

class Refresh extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _first : true
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState._first) {
      nextProps.trigger();
      return nextProps;
    }

    let run = false;
    for(const [ key, value ] of Object.entries(nextProps)) {
      if(key === 'trigger' || key === 'children') {
        continue;
      }

      if(!Object.is(value, prevState[key])) {
        run = true;
        break;
      }
    }

    if(run) {
      nextProps.trigger();
    }
    return nextProps;
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

Refresh.propTypes = {
  trigger  : PropTypes.func,
  children : PropTypes.node,
};

export default Refresh;