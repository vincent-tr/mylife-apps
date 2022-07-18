'use strict';

import { React, mui } from 'mylife-tools-ui';

// TODO:L w/h 90% on large device, fullScreen on small device

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const FullScreenDialog = ({ ...props }) => (
  <mui.Dialog fullScreen TransitionComponent={Transition} {...props} />
);

export default FullScreenDialog;
