'use strict';

import React from 'react';

const Icon = ({ ...props }) => (
  <img className='icon' draggable={false} {...props} />
);

export default Icon;