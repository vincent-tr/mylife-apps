import React from 'react';
import Dialogs from '../../modules/dialogs/components/dialogs';
import { LayoutRouter } from '../../modules/routing/components';
import ToolsProvider from './tools-provider';

const Application = (props) => (
  <ToolsProvider>
    <React.Fragment>
      <Dialogs />
      <LayoutRouter {...props} />
    </React.Fragment>
  </ToolsProvider>
);

export default Application;
