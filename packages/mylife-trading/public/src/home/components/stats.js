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

  const expanded = settings.showLastPositions;

  return (
    <mui.ExpansionPanel expanded={expanded} onChange={() => changeSettings({ showLastPositions: !expanded })}>
      <mui.ExpansionPanelSummary expandIcon={<mui.icons.ExpandMore />}>
        <mui.Typography>{'TOTO'}</mui.Typography>
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