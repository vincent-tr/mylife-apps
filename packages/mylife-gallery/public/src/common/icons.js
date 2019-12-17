'use strict';

import { React, mui } from 'mylife-tools-ui';

const {
  Announcement,
  Explore,
  Equalizer,
  Close,
  Fullscreen,
  CloudDownload,
  Info,
  Help,
  Block,
  PlayCircleOutline
} = mui.icons;

const Gallery = (props) => (
  <mui.SvgIcon viewBox="0 0 1000 1000" {...props}>
    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
      <path d="M794.1,3750.8c-323.2-86.1-575.7-344.3-661.8-671.3c-44-166.4-42.1-4552.1,0-4720.5c44-166.4,133.9-319.4,256.3-436.1c198.9-189.4,401.7-262,732.6-262h206.6v-206.6c0-330.9,72.7-533.6,262-732.5c55.5-59.3,153-135.8,214.2-168.3c235.3-124.3-15.3-116.7,3808.1-116.7c3056.4,0,3486.8,3.8,3586.2,28.7c329,86.1,583.4,342.4,669.4,673.3c44,166.4,42.1,4552.1,0,4720.5c-44,166.4-133.9,319.4-256.3,436.1c-198.9,189.4-401.7,262-732.5,262h-206.6v206.6c0,124.3-11.5,250.6-28.7,319.4c-86.1,329-342.4,583.4-673.3,669.4C7807.8,3794.8,952.8,3792.9,794.1,3750.8z M7918.7,3119.6c114.8-84.2,132-128.1,137.7-353.8l7.7-208.5H5101.4c-3228.6,0-3058.3,5.7-3280.2-107.1c-135.8-68.9-304.1-235.3-376.8-369.1c-120.5-227.6-116.7-162.6-116.7-2073.3v-1738.6l-208.5,7.7c-225.7,5.7-269.7,23-353.8,137.7c-40.2,51.7-40.2,65-45.9,2255c-1.9,1212.6,0,2230.2,5.7,2264.6c13.4,76.5,93.7,174,172.1,208.5c47.8,21,669.4,24.9,3513.6,21l3456.2-3.8L7918.7,3119.6z M9142.8,1895.5c28.7-21,70.8-63.1,91.8-91.8c40.2-51.6,40.2-59.3,40.2-2306.7c0-2247.4,0-2255-40.2-2306.7c-21-28.7-63.1-70.8-91.8-91.8l-51.6-40.2H5612.1H2132.9l-51.6,40.2c-28.7,21.1-70.8,63.1-91.8,91.8c-40.2,51.6-40.2,65-45.9,2255c-1.9,1212.6,0,2230.2,5.7,2264.6c13.4,76.5,93.7,174,172.1,208.5c47.8,21,669.4,24.9,3513.6,21l3456.2-3.8L9142.8,1895.5z"/>
      <path d="M4424.3,1155.3C4147,1052,4011.2,793.8,4089.6,526c112.8-386.4,606.3-495.4,872.2-191.3c76.5,86.1,133.9,227.6,133.9,329c0,86.1-53.6,235.3-112.8,317.5C4868,1136.2,4600.3,1220.3,4424.3,1155.3z"/>
      <path d="M6120.8,411.3c-26.8-24.9-281.1-447.6-566.1-942.9c-283.1-495.4-522.1-900.8-531.7-902.8c-7.7-3.8-112.8,168.3-233.3,380.6c-244.8,426.5-296.5,493.5-390.2,493.5c-118.6,0-110.9,9.6-659.9-944.8c-250.6-438-275.4-501.1-231.4-587.2c53.5-97.6-15.3-93.7,2094.4-93.7c2100.1,0,2061.8-1.9,2111.6,91.8c45.9,86.1,22.9,149.2-214.2,560.4C6696.5-135.7,6419.2,334.8,6371.4,390.2C6302.5,468.7,6195.4,478.2,6120.8,411.3z" />
    </g>
  </mui.SvgIcon>
);

export default {

  Gallery,

  menu: {
    Suggestions: Announcement,
    Browse: Explore,
    Stats : Equalizer
  },

  actions: {
    Close,
    Detail: Info,
    Download: CloudDownload,
    Fullscreen
  },

  documents: {
    Pending: Help,
    None: Block,
    Video: PlayCircleOutline
  }
};
