'use strict';

import { mui, useState, useEffect } from 'mylife-tools-ui';
import { utils } from 'mylife-tools-common';

export const SIZE = 200;

export const useCommonStyles = mui.makeStyles({
  container: {
    height: SIZE,
    width: SIZE
  },
  fallback: {
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
    safeGetThumbnail(sourceUrl).then(setObjectUrl);

    return () => {
      if(objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      setObjectUrl(null);
    };
  }, [sourceUrl]);

  return objectUrl;
}

export function useImages(sourceUrls) {
  const [objectUrls, setObjectUrls] = useState([]);

  useEffect(() => {
    setObjectUrls(sourceUrls.map(() => null));

    const fetchThumbnail = (index) => {
      safeGetThumbnail(sourceUrls[index]).then(objectUrl => setObjectUrls(array => utils.immutable.arrayUpdate(array, index, objectUrl)));
    };

    for(let i=0; i<sourceUrls.length; ++i) {
      fetchThumbnail(i);
    }

    return () => {
      for(const objectUrl of objectUrls) {
        if(objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      }

      setObjectUrls([]);
    };
  }, [sourceUrls]);

  return objectUrls;
}

async function safeGetThumbnail(id) {
  try {
    const response = await fetch(`/content/thumbnail/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch(err) {
    console.error(`Error loading thuumbnail ${id}`, err); // eslint-disable-line no-console
  }
}
