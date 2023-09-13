import { React, mui } from 'mylife-tools-ui';

// TODO:L w/h 90% on large device, fullScreen on small device

const Transition = React.forwardRef<React.Ref<unknown>, Omit<mui.SlideProps, 'direction'>>((props, ref) => (
  <mui.Slide direction='up' ref={ref} {...props} />
));

const FullScreenDialog: React.FunctionComponent<Omit<mui.DialogProps, 'fullScreen' | 'TransitionComponent'>> = (props) => (
  <mui.Dialog fullScreen TransitionComponent={Transition} {...props} />
);

export default FullScreenDialog;
