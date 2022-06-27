'use strict';

import { useDispatch, useMemo } from 'mylife-tools-ui';
import { setUiSettings } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    setUiSettings: (strategy, uiSettings) => dispatch(setUiSettings(strategy, uiSettings)),
  }), [dispatch]);
};

export function useUiSettings(strategy) {
  const { setUiSettings } = useConnect();
  const settings = getUiSettings(strategy);
  const changeSettings = changes => setUiSettings(strategy, formatUiSettings({ ...settings, ...changes }));
  const resetSettings = () => changeSettings(DEFAULT_SETTINGS);

  return { settings, changeSettings, resetSettings };
}

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