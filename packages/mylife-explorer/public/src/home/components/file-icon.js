'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { getFileTypeIcon } from './file-types';

const FileIcon = ({ data, ...props }) => {
  const Icon = getIcon(data);
  return (
    <Icon {...props} />
  );
}

FileIcon.propTypes = {
  data: PropTypes.object.isRequired
};

export default FileIcon;

function getIcon(data) {
  switch(data.type) {
    case 'Directory':
      return mui.icons.Folder;
    case 'File':
      return getFileTypeIcon(data.mime) || mui.icons.InsertDriveFile;
    default:
      return mui.icons.Help;
  }
}
