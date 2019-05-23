'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

const IconFileButton = ({ onFileSelected, children, ...props }) => {

  let fileInput;

  const handler = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    e.target.value = '';
    if(!file) { return; }
    onFileSelected(file);
  };

  return (
    <div>
      <mui.IconButton onClick={() => fileInput.click()} {...props}>
        {children}
      </mui.IconButton>

      <input
        ref={(input) => { fileInput = input; }}
        type="file"
        style={{display : 'none'}}
        onChange={handler}/>
    </div>
  );
};

IconFileButton.propTypes = {
  onFileSelected: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default IconFileButton;
