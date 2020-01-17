'use strict';

import { React, PropTypes, mui, useState } from 'mylife-tools-ui';
import { useCommonStyles } from '../common/styles';
import NavBar from '../common/nav-bar';
import Detail from './detail';
import Viewer from './viewer';

const VideoDialogContent = ({ documentWithInfo, onClose, onPrev, onNext }) => {
  const classes = useCommonStyles();
  const mediaUrl = `/content/video/${documentWithInfo.document._id}`;
  const [showDetail, setShowDetail] = useState(false);
  const toggleShowDetail = () => setShowDetail(value => !value);

  return (
    <React.Fragment>
      <NavBar
        className={classes.appBar}
        documentWithInfo={documentWithInfo}
        showDetail={true}
        onClose={onClose}
        onDetail={toggleShowDetail}
        onPrev={onPrev}
        onNext={onNext} />
      <mui.DialogContent className={classes.viewerContainer}>
        <Viewer mediaUrl={mediaUrl} className={classes.viewer}/>
        <Detail documentWithInfo={documentWithInfo} className={classes.detail} open={showDetail} />
      </mui.DialogContent>
    </React.Fragment>
  );
};

VideoDialogContent.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func
};

export default VideoDialogContent;
