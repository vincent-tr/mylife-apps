'use strict';

import { React, mui } from 'mylife-tools-ui';

const {
  AccountBox,
  Settings,
  Equalizer,
} = mui.icons;

const Trading = (props) => (
  <mui.SvgIcon viewBox="0 0 512 512" {...props}>
    <g transform="scale(1.2,1.2) translate(-42, -42)">
      <polygon points="445.772,233.709 445.772,149.264 361.327,149.264 361.327,179.682 393.846,179.682 297.615,275.912 
        214.385,192.682 96.647,310.421 96.647,149.264 66.229,149.264 66.229,362.346 445.772,362.346 445.772,331.929 118.155,331.929 
        214.385,235.699 297.615,318.929 415.354,201.19 415.354,233.709 		"/>
    </g>
  </mui.SvgIcon>
);

export default {

  Trading,

  tabs: {
    Broker: AccountBox,
    Strategy: Settings,
    Stat: Equalizer,
  },
};