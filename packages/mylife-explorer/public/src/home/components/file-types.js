'use strict';

import { mui } from 'mylife-tools-ui';
import Text from './viewer/text';
import Image from './viewer/image';
import Video from './viewer/video';
import Pdf from './viewer/pdf';
import Url from './viewer/url';

const types = {
  text: { viewer: Text, icon: mui.icons.Description },
  image: { viewer: Image, icon: mui.icons.Image },
  video: { viewer: Video, icon: mui.icons.OndemandVideo },
  pdf: { viewer: Pdf, icon: mui.icons.PictureAsPdf },
  url: { viewer: Url, icon: mui.icons.OpenInNew },
}

export function getFileTypeViewer(data) {
  const type = getFileType(data);
  return type && type.viewer;
}

export function getFileTypeIcon(data) {
  const type = getFileType(data);
  return type && type.icon;
}

function getFileType(data) {
  if(data.mime) {
    return getByMime(data.mime);
  }

  const ext = getExtension(data);
  if(ext) {
    return getByExtension(ext);
  }
}

function getByMime(mime) {
  const [type, subtype] = mime.split('/');
  switch(type) {
    case 'application':
      switch(subtype) {
        case 'json':
          return types.text;
        case 'pdf':
          return types.pdf;
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

function getByExtension(ext) {
  switch(ext) {
    case 'url':
      return types.url;
  }
}

function getExtension(data) {
  const name = data.name || data.path.split('/').pop();
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.substring(index + 1);
}