'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Box, Content } from './tools';

const Tab = ({ id, header, className, headerClassName, children }) => {

};

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

const TabPanel = ({ stretch, current, onChange, className, children }) => {
  return (
    <Box stretch={stretch}>
      TODO
    </Box>
  );
};

TabPanel.propTypes = {
  stretch: PropTypes.bool,
  current: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export { TabPanel, Tab };
