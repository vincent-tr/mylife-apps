'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';

const styles = {
  root: {
    position: 'fixed',
    top:0,
    bottom:0,
    left:0,
    right:0,
  },
  theme: muiStyles.getMuiTheme(muiStyles.lightBaseTheme)
};

// class needed by dnd.DragDropContext
class Application extends React.Component {

  render() {
    return (
      <muiStyles.MuiThemeProvider muiTheme={styles.theme}>
        <div style={styles.root}>
          <p> Hello ! </p>
        </div>
      </muiStyles.MuiThemeProvider>
    );
  }
}

export default Application;
