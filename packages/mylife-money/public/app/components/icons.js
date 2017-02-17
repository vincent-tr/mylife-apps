'use strict';

import ActionAccountBalance from 'material-ui/svg-icons/action/account-balance';
import ActionTimeline from 'material-ui/svg-icons/action/timeline';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';

import EditorModeComment from 'material-ui/svg-icons/editor/mode-comment';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';

import NavigationArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default {

  actions: {
    New     : ContentAddCircle,
    Edit    : EditorModeEdit,
    Delete  : NavigationClose,
    Move    : FileFolderOpen,
    Import  : ActionOpenInBrowser,
    Execute : ActionSettings,
    Comment : EditorModeComment,
  },

  tabs: {
    Management : ActionAccountBalance,
    Reporting  : ActionTimeline
  },

  Account : ActionAccountBalance,
  Group   : FileFolderOpen,

  utils: {
    ArrowDropRight : NavigationArrowDropRight
  }
};