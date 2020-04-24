'use strict';

import { React, mui } from 'mylife-tools-ui';
/*
const {
  Announcement,
  Explore,
  Equalizer,
  PhotoAlbum,
  People,
  Slideshow,
  AddCircle,
  Close,
  Fullscreen,
  CloudDownload,
  Info,
  Block,
  PlayCircleOutline,
  ChevronLeft,
  ChevronRight,
  Delete
} = mui.icons;
*/
const Explorer = (props) => (
  <mui.SvgIcon viewBox="0 0 24 24" {...props}>
    <path fill="#4da6ff" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
  </mui.SvgIcon>  
);

export default {

  Explorer,
};
