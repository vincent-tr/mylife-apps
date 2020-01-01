'use strict';

import { mui, useState, useEffect } from 'mylife-tools-ui';

export const SIZE = 200;

export function getThumbnailUrl(id) {
  return `/content/thumbnail/${id}`;
}

export const useCommonStyles = mui.makeStyles({
  container: {
    height: SIZE,
    width: SIZE
  },
  imageLoading: {
    display: 'none'
  },
  imageFallback: {
    height: '100%',
    width: '100%',
    color: mui.colors.grey[200]
  },
  loading: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    color: mui.colors.grey[200]
  }
});

export function useImage(sourceUrl) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    getThumbnail(sourceUrl).then(setObjectUrl, err => console.error('Error loading image', err)); // eslint-disable-line no-console

    return () => {
      if(objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
    };
  }, [sourceUrl]);

  return objectUrl;
}

async function getThumbnail(id) {
  const response = await fetch(`/content/thumbnail/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error, status = ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
