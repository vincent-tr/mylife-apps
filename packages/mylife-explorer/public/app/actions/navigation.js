'use strict';

import { push } from 'connected-react-router';

export const navigate = path => {
  if(path.startsWith('/')) {
    path = path.substring(1);
  }

  if(!path) {
    return push('/');
  }

  return push(`/path/${path}`);
};
