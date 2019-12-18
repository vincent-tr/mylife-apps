'use strict';

// https://github.com/rricard/react-exif-orientation-img/blob/master/src/ExifOrientationImg.js

import { React, PropTypes } from 'mylife-tools-ui';
import exifParser from 'exif-parser';
import exif2css from 'exif2css';

class OrientedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation : null
    };
  }

  async _onImageLoaded(event, ...otherArgs) {
    const imageElement = event.target;
    const { onLoad } = this.props;

    const orientation = await getOrientation(imageElement.src);
    console.log('orientation', orientation);
    this.setState({ orientation });

    onLoad && onLoad(event, ...otherArgs);
  }

  render() {
    const {
      src,
      alt,
      style = {},
      onLoad,
      ...imgProps
    } = this.props;

    const {
      orientation,
    } = this.state;

    void onLoad;

    return (
      <img
        onLoad={(...args) => this._onImageLoaded(...args)}
        src={src}
        alt={alt}
        style={{
          ...orientationToStyle(orientation),
          ...style,
        }}
        {...imgProps}
      />
    );
  }
}

export default OrientedImage;

async function getOrientation(url) {
  try {
    // hope we will use browser cache
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const content = await response.arrayBuffer();
    const parser = exifParser.create(content);
    const { tags } = parser.parse();
    return tags.Orientation || null;
  } catch(err) {
    console.error(`Error loading image '${url}'`, err);
    return null;
  }
}

function orientationToStyle(orientation) {
  if(!orientation) {
    return {};
  }

  // only keep rotate
  const style = exif2css(orientation);
  const rotate = style.transformStrings && style.transformStrings.rotate;
  if(!rotate) {
    return {};
  }

  return { transform : rotate };
}
