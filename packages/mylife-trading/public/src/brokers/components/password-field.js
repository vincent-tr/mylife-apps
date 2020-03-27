'use strict';

import { React, useState, useEffect, mui } from 'mylife-tools-ui';

const PasswordField = ({ crypted, onSet, ...props }) => {
  const [value, setValue] = useState('');
  // reset value on change
  useEffect(() => setValue(''), [crypted]);

  const handleOk = () => onSet(value);

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const inputProps = value ? {
    endAdornment:
      <mui.InputAdornment position='end'>
        <mui.IconButton
          onClick={handleOk}
          onMouseDown={handleMouseDownPassword}
        >
          <mui.icons.Create />
        </mui.IconButton>
      </mui.InputAdornment>
  } : null;

  return (
    <mui.TextField 
      value={value}
      onChange={e => setValue(e.target.value)}
      type='password'
      InputProps={inputProps}
      {...props}
    />
  );
};

export default PasswordField;
