'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import common from '../common/index';
import tabStyles from '../base/tab-styles';

class StockAdd extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      count    : 1,
      capacity : null,
      year     : null,
      date     : null,
      price    : null,
      comment  : null
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return <div>stock-add</div>;
  }
}

StockAdd.propTypes = {
  article    : PropTypes.string,
  capacities : PropTypes.arrayOf(PropTypes.object),
  onAdd      : PropTypes.func.isRequired
};

export default StockAdd;
