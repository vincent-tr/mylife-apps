'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Content as ContainerContent } from '../containers/tools';

const Content = ({ children }) => (
  <ContainerContent className='content'>
    {children}
  </ContainerContent>
);

Content.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Content;