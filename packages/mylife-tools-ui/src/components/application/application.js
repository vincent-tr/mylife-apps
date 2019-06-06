'use strict';

import React from 'react';

import ToolsProvider from './tools-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';
import { LayoutRouter } from '../../modules/routing/components';

const Application = (props) => (
  <ToolsProvider>
    <React.Fragment>
      <Dialogs />
      <LayoutRouter {...props} />
    </React.Fragment>
  </ToolsProvider>
);

export default Application;
