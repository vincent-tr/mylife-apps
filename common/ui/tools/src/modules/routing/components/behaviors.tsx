import { useToolsAction, useToolsSelector } from '../../../services/store-api';
import { navigate, getLocation } from '../store';

export function useRoutingConnect() {
  return {
    location: useToolsSelector(getLocation),
    navigate: useToolsAction(navigate),
  };
}
