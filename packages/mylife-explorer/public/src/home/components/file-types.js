'use strict';

import { mui } from 'mylife-tools-ui';
import Text from './viewer/text';
import Image from './viewer/image';
import Video from './viewer/video';

const types = {
  text: { viewer: Text, icon: mui.icons.Description },
  image: { viewer: Image, icon: mui.icons.Image },
  video: { viewer: Video, icon: mui.icons.OndemandVideo },
}

function getFileType(mime) {
  if(!mime) {
    return;
  }
  
  const [type, subtype] = mime.split('/');
  switch(type) {
    case 'application':
      switch(subtype) {
        case 'json':
          return types.text;
      }
      break;

    case 'text':
      return types.text;

    case 'image':
      return types.image;

    case 'video':
      return types.video;
  }
}

export function getFileTypeViewer(mime) {
  const type = getFileType(mime);
  return type && type.viewer;
}

export function getFileTypeIcon(mime) {
  const type = getFileType(mime);
  return type && type.icon;
}