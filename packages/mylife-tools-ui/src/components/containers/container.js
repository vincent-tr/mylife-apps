'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Box, Content } from './tools';

import './container.scss';

const Container =  ({ stretch, scroll, borders, className, containerClassName, children }) => (
  <Box stretch={stretch} className={classNames('container-container-box', containerClassName, { borders })}>
    <Content className={classNames('container-container-content', className, { scroll })}>
      {children}
    </Content>
  </Box>
);

Container.propTypes = {
  stretch: PropTypes.bool,
  scroll: PropTypes.bool,
  borders: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Container;
