import { io, createAction } from 'mylife-tools-ui';
import actionTypes, { SetValues } from './types';


const local = {
  setValues: createAction<SetValues>(actionTypes.SET_VALUES),
};


export enum StatsType {
	Day = 1,
	Month,
	Year,
}

export const getValues = (type: StatsType, timestamp: Date, sensors: string[]) => async (dispatch) => {
  const values: SetValues = await dispatch(io.call({
    service: 'stats',
    method: 'getValues',
    type,
    timestamp,
    sensors,
  }));

  dispatch(local.setValues(values));
};
