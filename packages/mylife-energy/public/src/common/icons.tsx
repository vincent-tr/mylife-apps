'use strict';

import { React, mui } from 'mylife-tools-ui';

const {
  Info,
  CloudDownload
} = mui.icons;

const Energy = (props) => (
  <mui.SvgIcon viewBox="0 0 88.408 88.408" {...props}>
    <polygon points="67.41,0 34.256,0 20.999,47.732 34.283,47.732 22.988,88.408 26.967,88.408 65.418,40.674 45.939,40.674"/>
  </mui.SvgIcon>  
);

export default {

  Energy,

  actions: {
    Detail: Info,
    Download: CloudDownload,
  },
};
