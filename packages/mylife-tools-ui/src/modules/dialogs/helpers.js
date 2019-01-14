'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export async function showDialog(Impl) {
  return new Promise(accept => {
    const node = document.createElement('div');

    const onClose = (result) => {
      ReactDOM.unmountComponentAtNode(node);
      document.body.removeChild(node);
      accept(result);
    };

    document.body.appendChild(node);
    ReactDOM.render(<Impl open={true} onClose={onClose} />, node);
  });
}
