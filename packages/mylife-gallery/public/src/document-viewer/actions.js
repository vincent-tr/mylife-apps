'use strict';

import { io } from 'mylife-tools-ui';

export function updateDocument(document, values) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'updateDocument',
      type: document._entity,
      id: document._id,
      values
    }));

  };
}
