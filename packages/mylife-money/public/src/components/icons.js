'use strict';

import AccountBalance from '@material-ui/icons/AccountBalance';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import ShowChart from '@material-ui/icons/ShowChart';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Settings from '@material-ui/icons/Settings';
import AddCircle from '@material-ui/icons/AddCircle';
import ModeComment from '@material-ui/icons/ModeComment';
import Edit from '@material-ui/icons/Edit';
import FolderOpen from '@material-ui/icons/FolderOpen';
import Close from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
    Management : FormatListBulleted,
    Reporting  : ShowChart
  },

  Account : AccountBalance,
  Group   : FolderOpen,

  tree : { ExpandLess, ExpandMore  }
};
