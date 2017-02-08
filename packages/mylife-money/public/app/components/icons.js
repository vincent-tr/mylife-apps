'use strict';

import ActionAccountBalance from 'material-ui/svg-icons/action/account-balance';
import ActionTimeline from 'material-ui/svg-icons/action/timeline';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';

import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';

import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default {

  actions: {
    New    : FileCreateNewFolder,
    Edit   : ActionOpenInBrowser,
    Delete : NavigationClose,
    Move   : FileFolderOpen,
  },

  tabs: {
    Management : ActionAccountBalance,
    Reporting  : ActionTimeline
  },

  Group: FileFolderOpen,
};