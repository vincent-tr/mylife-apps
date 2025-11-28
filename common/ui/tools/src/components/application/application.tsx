import React from 'react';
import Dialogs from '../../modules/dialogs/components/dialogs';
import { LayoutRouter } from '../../modules/routing/components';
import ToolsProvider from './tools-provider';

export default function Application(props: React.ComponentProps<typeof LayoutRouter>) {
  return (
    <ToolsProvider>
      <React.Fragment>
        <Dialogs />
        <LayoutRouter {...props} />
      </React.Fragment>
    </ToolsProvider>
  );
}
