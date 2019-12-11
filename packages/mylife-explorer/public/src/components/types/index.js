'use strict';

import Default     from './default';
import Directory   from './directory';
import Text        from './text';
import Image       from './image';
import Video       from './video';

const types = {
  unknown   : { icon : 'file outline',           Component : Default },
  directory : { icon : 'folder',                 Component : Directory },
  mimetext  : { icon : 'file alternate outline', Component : Text },
  mimeimage : { icon : 'file image outline',     Component : Image },
  mimevideo : { icon : 'file video outline',     Component : Video },
  mimeaudio : { icon : 'file audio outline',     Component : Default },
};

// file archive outline

export function getTypeInfo({ type, mime }) {
  if(type === 'Directory') {
    return types.directory;
  }

  if(type !== 'File' || !mime) {
    return types.unknown;
  }

  const { type : mtype } = splitMime(mime);
  const mimeType = types[`mime${mtype}`];
  if(mimeType) {
    return mimeType;
  }

  return types.unknown;
}

function splitMime(mime) {
  const parts = mime.split('/');
  return {
    type    : parts[0],
    subtype : parts[1]
  };
}

