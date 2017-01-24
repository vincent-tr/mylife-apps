'use strict';

import React from 'react';
import * as mui from 'material-ui';

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
    height: '100%'
  },
  paperLeft:{
    flex: 1,
    height: '100%',
    textAlign: 'center',
  },
  paperRight:{
    flex: 2,
    height: '100%',
    textAlign: 'center',
  }
};

const Management = ({ }) => (
  <div style={styles.div}>
    <mui.Paper zDepth={1} style={styles.paperLeft}>
      <p>Tree</p>
    </mui.Paper>
    <mui.Paper zDepth={1} style={styles.paperRight}>
        <p>Details</p>
    </mui.Paper>
  </div>
);

Management.propTypes = {
};

export default Management;
