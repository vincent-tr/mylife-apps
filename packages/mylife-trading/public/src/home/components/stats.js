'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import StatsTable from './stats-table';
import { useUiSettings } from './ui-settings';

const Stats = ({ strategy }) => {
  const { settings, changeSettings, resetSettings } = useUiSettings(strategy);
  const diffPositionCount = value => changeSettings({lastPositionsCount: settings.lastPositionsCount + value })

  return (
    <>
      <mui.Tooltip title='Afficher plus de statistiques'>
      <mui.IconButton onClick={() => diffPositionCount(1)}>
          <mui.icons.Add />
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Tooltip title='Afficher moins de statistiques'>
        <mui.IconButton onClick={() => diffPositionCount(-1)}>
          <mui.icons.Remove />
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Tooltip title={'Ré-initialiser l\'affichage'}>
        <mui.IconButton onClick={() => resetSettings()}>
          <mui.icons.Clear />
        </mui.IconButton>
      </mui.Tooltip>

      <StatsTable strategy={strategy} count={settings.lastPositionsCount} />
    </>
  );
};

Stats.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Stats;
