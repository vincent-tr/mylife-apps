'use strict';

// https://github.com/rricard/react-exif-orientation-img/blob/master/src/ExifOrientationImg.js

import React, { Component } from 'react';
import EXIF from 'exif-js';
import exif2css from 'exif2css';

class OrientedImage extends Component {
  /*
  props: Object;
  state: {
    orientation: ?number,
  } = {
    orientation: null,
  };
*/
  _onImageLoaded(...args) {
    const [event, ...otherArgs] = args;
    const imageElement = event.target;
    const { onLoad } = this.props;

    // Fix for an issue affecting exif-js: see https://github.com/exif-js/exif-js/issues/95
    const windowImage = window.Image;
    window.Image = null;

    // delete cached data of old image
    delete imageElement.exifdata;

    // Do the actual EXIF operations
    if (!EXIF.getData(imageElement, () => {
      this.setState({
        orientation: EXIF.getTag(imageElement, 'Orientation'),
      });
      onLoad && onLoad(event, ...otherArgs);
    })) {
      onLoad && onLoad(event, ...otherArgs);
    }

    // Re-establish the reference
    window.Image = windowImage;
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
        onLoad={this._onImageLoaded.bind(this)}
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

/*
function snakeToCamelCaseKeys(obj) {
  return Object.keys(obj)
    .map(k => ({
      [k.replace(/(-\w)/g, m => m[1].toUpperCase())]: obj[k],
    }))
    .reduce((a, b) => ({...a, ...b}), {});
}
*/

function orientationToStyle(orientation) {
  if(!orientation) {
    return {};
  }

  // return snakeToCamelCaseKeys(exif2css(orientation));

  // only keep rotate
  const style = exif2css(orientation);
  const rotate = style.transformStrings && style.transformStrings.rotate;
  if(!rotate) {
    return {};
  }

  return { transform : rotate };
}
