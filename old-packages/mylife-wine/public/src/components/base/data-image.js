'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const DataImage = (props) => {
  const { data, ...otherProps } = props;
  return (<img src={ data ? `data:;base64,${data}` : null} {...otherProps}/>);
};

DataImage.propTypes = {
  data: PropTypes.string
};

export default DataImage;
