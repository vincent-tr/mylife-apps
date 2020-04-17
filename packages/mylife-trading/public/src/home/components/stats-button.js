'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { useUiSettings } from './ui-settings';

const StatsButton = ({ strategy }) => {
  const [settings, changeSettings] = useUiSettings(strategy);
  const expanded = settings.showLastPositions;
  return (
    <mui.Tooltip title={expanded ? 'Cacher les statistiques' : 'Afficher les statistiques'}>
      <mui.IconButton onClick={() => changeSettings({ showLastPositions: !expanded })}>
        {expanded ? (<mui.icons.ExpandLess />) : (<mui.icons.ExpandMore />)}
      </mui.IconButton>
    </mui.Tooltip>
  );
};

StatsButton.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default StatsButton;
