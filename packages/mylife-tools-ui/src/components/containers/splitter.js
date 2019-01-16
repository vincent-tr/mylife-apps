'use strict';

import React from 'react';
import SplitterLayout from 'react-splitter-layout';

import './splitter.scss';

const Splitter = ({ ...props }) => (
  <SplitterLayout {...props} />
);

export default Splitter;