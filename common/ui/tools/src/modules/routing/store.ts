import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { STATE_PREFIX } from '../../services/store-api';

interface RoutingState {
  location: string;
}

const ACTION_NAVIGATE = `${STATE_PREFIX}/routing/navigate`;

const initialState: RoutingState = {
  location: '',
};

const routingSlice = createSlice({
  name: `${STATE_PREFIX}/routing`,
  initialState,
  reducers: {
    locationChange: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
  },
  selectors: {
    getLocation: (state) => state.location,
  },
});

const local = {
  locationChange: routingSlice.actions.locationChange,
};

export const { locationChange } = routingSlice.actions;
export const { getLocation } = routingSlice.selectors;
export const navigate = createAction<string>(ACTION_NAVIGATE);

export default routingSlice.reducer;

export const middleware = (/*store*/) => (next) => {
  const history = createBrowserHistory();

  const sendHistory = () => {
    const location = decodeURI(history.location.pathname);
    next(local.locationChange(location));
  };

  history.listen(sendHistory);
  sendHistory();

  return (action) => {
    if (action.type === ACTION_NAVIGATE) {
      const location: string = action.payload;
      history.push(location);
    }

    return next(action);
  };
};
