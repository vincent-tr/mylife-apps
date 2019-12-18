'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import DialogContentImage from './image/dialog-content';
import DialogContentVideo from './video/dialog-content';
import DialogContentOther from './other/dialog-content';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const DialogContent = ({ document, ...props }) => {
  switch(document._entity) {
    case 'image':
      return (<DialogContentImage document={document} {...props} />);
    case 'video':
      return (<DialogContentVideo document={document} {...props} />);
    case 'other':
      return (<DialogContentOther document={document} {...props} />);
  }
};

DialogContent.propTypes = {
  document: PropTypes.object.isRequired,
};

const Dialog = ({ show, proceed, options }) => {
  const { document } = options;

  return (
    <mui.Dialog open={show} onClose={proceed} fullScreen TransitionComponent={Transition}>
      <DialogContent document={document} onClose={proceed} />
    </mui.Dialog>
  );
};

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;
