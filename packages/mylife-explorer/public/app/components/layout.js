'use strict';

import React                      from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';
import Navigation                 from './navigation';
import Infos                      from './infos';
import Dispatcher                 from './dispatcher';

const styles = {
  root : {
    display       : 'flex',
    flexDirection : 'column',
    minHeight     : '100vh'
  },
  header : {
    margin : 0
  },
  container : {
    flex          : 1,
    display       : 'flex',
    flexDirection : 'row'
  },
  infos : {
    width    : 350,
    position : 'relative',
    margin   : 0
  },
  content : {
    flex     : 1,
    position : 'relative'
  }
};

const Layout = () => (
  <div style={styles.root}>
    <Segment fixed='top' textAlign='center' as='header' style={styles.header}>
      <Header as='h1' image={<Image size='small' src='/images/favicon.ico' />} content='Mylife Explorer' />
      <Navigation />
    </Segment>

    <div style={styles.container}>
      <Segment fixed='left' style={styles.infos}>
        <Infos />
      </Segment>
      <div style={styles.content}>
        <Dispatcher />
      </div>
    </div>
  </div>
);

export default Layout;