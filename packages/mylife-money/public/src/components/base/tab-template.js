'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';

const baseStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  textAlign: 'initial',
};

const TabTemplate = ({ selected, children }) => {

  const additionalStyle = {};

  if (!selected) {
    additionalStyle.height = 0;
    additionalStyle.overflow = 'hidden';
  }

  return (
    <div style={Object.assign({}, baseStyle, additionalStyle)}>
      {children}
    </div>
  );
};

TabTemplate.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
};

export default TabTemplate;