'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as utils from './utils';
import NavBar from './nav-bar';
import ViewerImage from './viewer-image';
import ViewerVideo from './viewer-video';
import ViewerOther from './viewer-other';

const useStyles = mui.makeStyles({
  appBar: {
    position: 'relative',
  },
  viewerContainer: {
    display: 'flex'
  },
  viewer: {
    flex: 1,
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const Viewer = ({ document, ...props }) => {
  switch(document._entity) {
    case 'image':
      return (<ViewerImage document={document} {...props} />);
    case 'video':
      return (<ViewerVideo document={document} {...props} />);
    case 'other':
      return (<ViewerOther document={document} {...props} />);
  }
};

Viewer.propTypes = {
  document: PropTypes.object.isRequired,
};

const Dialog = ({ show, proceed, options }) => {
  const classes = useStyles();
  const { document } = options;
  const info = utils.getInfo(document);

  return (
    <mui.Dialog open={show} onClose={proceed} fullScreen TransitionComponent={Transition}>
      <NavBar className={classes.appBar} document={document} info={info} onClose={proceed} onInfo={() => console.log('onInfo')} />
      <mui.DialogContent className={classes.viewerContainer}>
        <Viewer document={document} info={info} className={classes.viewer}/>
      </mui.DialogContent>
    </mui.Dialog>
  );
};

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;
