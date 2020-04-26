'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const FileIcon = ({ data, ...props }) => {
  switch(data.type) {
    case 'Directory':
      return (<mui.icons.Folder {...props} />);
    case 'File':
      // TODO: known file types
      return (<mui.icons.InsertDriveFile {...props} />);
    default:
      return (<mui.icons.Help {...props} />);
  }
}

FileIcon.propTypes = {
  data: PropTypes.object.isRequired
};

export default FileIcon;
