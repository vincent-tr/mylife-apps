'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import StatsTable from './stats-table';
import { setUiSettings } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    setUiSettings: (strategy, uiSettings) => dispatch(setUiSettings(strategy, uiSettings)),
  }), [dispatch]);
};

const Stats = ({ strategy }) => {
  const { setUiSettings } = useConnect();
  const settings = getUiSettings(strategy);
  const changeSettings = changes => setUiSettings(strategy, formatUiSettings({ ...settings, ...changes }));
  const diffPositionCount = value => changeSettings({lastPositionsCount: settings.lastPositionsCount + value })
  const resetSettings = () => changeSettings(DEFAULT_SETTINGS);

  const expanded = settings.showLastPositions;

  // TODO: change ExpansionPanelSummary cursor
  // TODO: remove borders
  return (
    <mui.ExpansionPanel expanded={expanded}>
      <mui.ExpansionPanelSummary>
        <mui.IconButton onClick={() => changeSettings({ showLastPositions: !expanded })}>
          {expanded ? (<mui.icons.ExpandLess />) : (<mui.icons.ExpandMore />)}
        </mui.IconButton>

        {expanded && (
          <>
           <mui.Tooltip title='Afficher plus de données de statistiques'>
            <mui.IconButton onClick={() => diffPositionCount(1)}>
                <mui.icons.Add />
              </mui.IconButton>
           </mui.Tooltip>

            <mui.Tooltip title='Afficher moins de données de statistiques'>
              <mui.IconButton onClick={() => diffPositionCount(-1)}>
                <mui.icons.Remove />
              </mui.IconButton>
            </mui.Tooltip>

            <mui.Tooltip title={'Ré-initialiser l\'affichage'}>
              <mui.IconButton onClick={() => resetSettings()}>
                <mui.icons.Clear />
              </mui.IconButton>
            </mui.Tooltip>
          </>
        )}
      </mui.ExpansionPanelSummary>
      <mui.ExpansionPanelDetails>
        <StatsTable strategy={strategy} count={settings.lastPositionsCount} />
      </mui.ExpansionPanelDetails>
    </mui.ExpansionPanel>
  );
};

Stats.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Stats;

const DEFAULT_SETTINGS = {
  showLastPositions: true,
  lastPositionsCount: 8
};

function getUiSettings(strategy) {
  const uiSettings = strategy.uiSettings ? {... strategy.uiSettings} : {};
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (uiSettings[key] == null) {
      uiSettings[key] = value;
    }
  }
  return uiSettings;
}

function formatUiSettings(uiSettings) {
  let empty = true;
  const result = {};

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const newValue = uiSettings[key];
    if(newValue !== value) {
      result[key] = newValue;
      empty = false;
    }
  }

  return empty ? null : result;
}