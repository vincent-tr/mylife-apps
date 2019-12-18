'use strict';

// https://github.com/rricard/react-exif-orientation-img/blob/master/src/ExifOrientationImg.js

import { React, PropTypes, useState, useEffect, fireAsync } from 'mylife-tools-ui';
import exifParser from 'exif-parser';
import exif2css from 'exif2css';

const OrientedImage = ({ src, style, ...props}) => {
  const [orientationStyle, setOrientationStyle] = useState(null);

  useEffect(() => {
    if(!src) {
      setOrientationStyle(null);
      return;
    }

    fireAsync(async () => {
      const orientation = await safeGetOrientation(src);
      const style = orientationToStyle(orientation);
      setOrientationStyle(style);
    });
  }, [src]);

  return (
    <img src={src} style={{...orientationStyle, ...style}} {...props} />
  );
};

OrientedImage.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object
};

export default OrientedImage;

async function safeGetOrientation(url) {
  try {
    // hope we will use browser cache
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const content = await response.arrayBuffer();
    const parser = exifParser.create(content);
    const { tags } = parser.parse();
    return tags.Orientation;
  } catch(err) {
    console.error(`Error loading image '${url}'`, err); // eslint-disable-line no-console
    return null;
  }
}

function orientationToStyle(orientation) {
  if(!orientation) {
    return null;
  }

  // only keep rotate
  const style = exif2css(orientation);
  const rotate = style.transformStrings && style.transformStrings.rotate;
  if(!rotate) {
    return null;
  }

  return { transform : rotate };
}
