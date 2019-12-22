'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { getInfo } from '../../../common/document-utils';
import { useCommonStyles } from '../common/styles';
import NavBar from '../common/nav-bar';
import Viewer from './viewer';

const OtherDialogContent = ({ document, onClose }) => {
  const classes = useCommonStyles();
  const info = getInfo(document);

  return (
    <React.Fragment>
      <NavBar className={classes.appBar} document={document} info={info} onClose={onClose} />
      <mui.DialogContent className={classes.viewerContainer}>
        <Viewer document={document} info={info} className={classes.viewer}/>
      </mui.DialogContent>
    </React.Fragment>
  );
};

OtherDialogContent.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default OtherDialogContent;
