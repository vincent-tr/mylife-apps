'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../../components/icons';

const ExportButton = ({ onClick, ...props }) => (
  <mui.Tooltip title='Exporter les données'>
    <mui.IconButton {...props} onClick={wrapClick(onClick)}>
      <icons.actions.Export />
    </mui.IconButton>
  </mui.Tooltip>
);

ExportButton.propTypes = {
  onClick: PropTypes.func
};

export default ExportButton;

function wrapClick(onClick) {
  if(!onClick) {
    return onClick;
  }

  return (e) => {
    e.stopPropagation();
    onClick(e);
  };
}
