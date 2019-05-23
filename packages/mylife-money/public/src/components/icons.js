'use strict';

import AccountBalance from '@material-ui/icons/AccountBalance';
import Timeline from '@material-ui/icons/Timeline';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Settings from '@material-ui/icons/Settings';
import AddCircle from '@material-ui/icons/AddCircle';
import ModeComment from '@material-ui/icons/ModeComment';
import Edit from '@material-ui/icons/Edit';
import FolderOpen from '@material-ui/icons/FolderOpen';
import Close from '@material-ui/icons/Close';

export default {

  actions: {
    New     : AddCircle,
    Edit    : Edit,
    Delete  : Close,
    Move    : FolderOpen,
    Import  : OpenInBrowser,
    Execute : Settings,
    Comment : ModeComment,
  },

  tabs: {
    Management : AccountBalance,
    Reporting  : Timeline
  },

  Account : AccountBalance,
  Group   : FolderOpen,
};
