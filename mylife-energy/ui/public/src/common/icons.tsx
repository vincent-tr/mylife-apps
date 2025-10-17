'use strict';

import { React, mui } from 'mylife-tools-ui';

const {
  LiveTv,
  Functions,
  NotInterested,
  Timer,
  NetworkCheck,
  EvStation,
  DirectionsCar,
  Help,
  Check,
  CloudOff,
  Error,
  Equalizer,
  ArrowLeft,
  ArrowRight,
  Settings,
} = mui.icons;

const Energy = (props) => (
  <mui.SvgIcon viewBox="0 0 88.408 88.408" {...props}>
    <polygon points="67.41,0 34.256,0 20.999,47.732 34.283,47.732 22.988,88.408 26.967,88.408 65.418,40.674 45.939,40.674"/>
  </mui.SvgIcon>  
);

// https://fonts.google.com/icons?icon.query=electrical+services&icon.platform=web&icon.set=Material+Symbols
const DeviceTypeMain = (props) => (
  <mui.SvgIcon viewBox="0 0 24 24" {...props}>
    <g>
      <path d="M21,14c0-0.55-0.45-1-1-1h-2v2h2C20.55,15,21,14.55,21,14z"/>
      <path d="M20,17h-2v2h2c0.55,0,1-0.45,1-1C21,17.45,20.55,17,20,17z"/>
      <path d="M12,14h-2v4h2c0,1.1,0.9,2,2,2h3v-8h-3C12.9,12,12,12.9,12,14z"/>
      <path d="M5,13c0-1.1,0.9-2,2-2h1.5c1.93,0,3.5-1.57,3.5-3.5S10.43,4,8.5,4H5C4.45,4,4,4.45,4,5c0,0.55,0.45,1,1,1h3.5 C9.33,6,10,6.67,10,7.5S9.33,9,8.5,9H7c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4h2v-2H7C5.9,15,5,14.1,5,13z"/>
    </g>
  </mui.SvgIcon>  
);

// https://fonts.google.com/icons?icon.query=home&icon.platform=web&icon.set=Material+Symbols
const DeviceTypeTotal = (props) => (
  <mui.SvgIcon viewBox="0 -960 960 960" {...props}>
    <path d="M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z"/>
  </mui.SvgIcon>  
);

// https://fonts.google.com/icons?icon.query=sunny&icon.platform=web&icon.set=Material+Symbols
const DeviceTypeSolar = (props) => (
  <mui.SvgIcon viewBox="0 -960 960 960" {...props}>
    <path d="M450-770v-150h60v150h-60Zm256 106-42-42 106-107 42 43-106 106Zm64 214v-60h150v60H770ZM450-40v-150h60v150h-60ZM253-665 148-770l42-42 106 106-43 41Zm518 517L664-254l41-41 108 104-42 43ZM40-450v-60h150v60H40Zm151 302-43-42 105-105 22 20 22 21-106 106Zm289-92q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-60q75 0 127.5-52.5T660-480q0-75-52.5-127.5T480-660q-75 0-127.5 52.5T300-480q0 75 52.5 127.5T480-300Zm0-180Z"/>
  </mui.SvgIcon>  
);

// https://www.svgrepo.com/svg/342292/tesla
const Tesla = (props) => (
  <mui.SvgIcon viewBox="0 0 32 32" {...props}>
    <path d="M16 7.151l3.302-4.036c0 0 5.656 0.12 11.292 2.74-1.443 2.182-4.307 3.25-4.307 3.25-0.193-1.917-1.536-2.385-5.807-2.385l-4.479 25.281-4.51-25.286c-4.24 0-5.583 0.469-5.776 2.385 0 0-2.865-1.057-4.307-3.24 5.635-2.62 11.292-2.74 11.292-2.74l3.302 4.031h-0.005zM16 1.953c4.552-0.042 9.766 0.703 15.104 3.036 0.714-1.292 0.896-1.859 0.896-1.859-5.833-2.313-11.297-3.109-16-3.13-4.703 0.021-10.167 0.813-16 3.13 0 0 0.26 0.703 0.896 1.865 5.339-2.344 10.552-3.083 15.104-3.047z"/>
  </mui.SvgIcon>
);

export default {

  Energy,

  actions: {
    Off: NotInterested,
    Fast: Timer,
    Smart: NetworkCheck,
    Settings,
    Prev: ArrowLeft,
    Next: ArrowRight,
  },

  tabs: {
    Live: LiveTv,
    Tesla,
    Stats: Equalizer,
  },

  devices: {
    Main: DeviceTypeMain,
    Total: DeviceTypeTotal,
    Solar: DeviceTypeSolar,
    Computed: Functions,
  },

  tesla: {
    WallConnector: EvStation,
    Car: DirectionsCar,
  },

  deviceStatus: {
    Unknown: Help,
    Online: Check,
    Offline: CloudOff,
    Failure: Error,
  }
};
