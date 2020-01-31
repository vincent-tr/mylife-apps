'use strict';

import { io } from 'mylife-tools-ui';

export const createPerson = (firstName, lastName) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'createPerson',
      values: { firstName, lastName }
    }));
  };
};

export const deletePerson = (id) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'deletePerson',
      id
    }));
  };
};

export const updatePerson = (person, values) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'updatePerson',
      id: person._id,
      values
    }));
  };
};
