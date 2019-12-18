'use strict';

import { React, PropTypes, mui, useState } from 'mylife-tools-ui';
import { getInfo } from '../../document-utils';
import { useCommonStyles } from '../common/styles';
import NavBar from '../common/nav-bar';
import Detail from './detail';
import Viewer from './viewer';

const VideoDialogContent = ({ document, onClose }) => {
  const classes = useCommonStyles();
  const info = getInfo(document);
  const [showDetail, setShowDetail] = useState(false);
  const toggleShowDetail = () => setShowDetail(value => !value);

  return (
    <React.Fragment>
      <NavBar className={classes.appBar} document={document} info={info} showDetail={true} onClose={onClose} onDetail={toggleShowDetail} />
      <mui.DialogContent className={classes.viewerContainer}>
        <Viewer document={document} info={info} className={classes.viewer}/>
        <Detail document={document} info={info} className={classes.detail} open={showDetail} />
      </mui.DialogContent>
    </React.Fragment>
  );
};

VideoDialogContent.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default VideoDialogContent;
