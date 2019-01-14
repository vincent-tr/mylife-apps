'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export async function showDialog(DialogComponent, { requestCloseValue = 'abort', ...props } = {}) {
  return new Promise(accept => {
    const node = document.createElement('div');

    const onClose = (result) => {
      ReactDOM.unmountComponentAtNode(node);
      document.body.removeChild(node);
      accept(result);
    };

    document.body.appendChild(node);
    ReactDOM.render(<DialogComponent open={true} onClose={() => onClose(requestCloseValue)} {...props} />, node);
  });
}
