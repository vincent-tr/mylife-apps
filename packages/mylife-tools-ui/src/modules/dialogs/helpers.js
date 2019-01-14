'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export async function showDialog(Impl) {
  return new Promise(accept => {
    const node = document.createElement('div');

    class Root extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          open: true
        };
      }

      onClose = (result) => {
        this.setState({ open: false });
        ReactDOM.unmountComponentAtNode(node);
        document.body.removeChild(node);
        accept(result);
      }

      render() {
        return (
          <Impl open={this.state.open} onClose={this.onClose} />
        );
      }
    }

    document.body.appendChild(node);
    // TODO: why no render ?
    ReactDOM.createPortal(<Root />, node);
  });
}
