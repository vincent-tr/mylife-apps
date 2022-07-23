'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { useCommonStyles } from '../common/styles';
import NavBar from '../common/nav-bar';
import Viewer from './viewer';

const OtherDialogContent = ({ documentWithInfo, onClose, onPrev, onNext }) => {
  const classes = useCommonStyles();

  return (
    <React.Fragment>
      <NavBar
        className={classes.appBar}
        documentWithInfo={documentWithInfo}
        onClose={onClose}
        onPrev={onPrev}
        onNext={onNext}/>
      <mui.DialogContent className={classes.viewerContainer}>
        <Viewer documentWithInfo={documentWithInfo} className={classes.viewer}/>
      </mui.DialogContent>
    </React.Fragment>
  );
};

OtherDialogContent.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func
};

export default OtherDialogContent;
