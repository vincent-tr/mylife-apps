'use strict';

const exifParser = require('exif-parser');

exports.getMetadata = function (content) {
  const parser = exifParser.create(content);
  const { tags } = parser.parse();
  const model = tags.Model;
  const date = formatExifDate(tags.DateTimeOriginal) || formatExifDate(tags.CreateDate) || formatExifDate(tags.ModifyDate);
  const gps = formatExifGPS(tags);

  const metadata = { model, date };
  if(gps) {
    metadata.gpsLatitude = gps.latitude;
    metadata.gpsLongitude = gps.longitude;
  }

  return metadata;
};

function formatExifDate(value) {
  if(value < 0) {
    // got -2211753600 for null values
    // consider all pre-epoch as nulls
    return null;
  }
  return new Date(value * 1000);
}

function formatExifGPS(tags) {
  let { GPSLatitude: latitude, GPSLongitude: longitude } = tags;
  const { GPSLatitudeRef, GPSLongitudeRef } = tags;

  if(!latitude || !longitude) {
    return;
  }

  if(GPSLatitudeRef === 'S') {
    latitude *= -1;
  }
  if(GPSLongitudeRef === 'W') {
    longitude *= -1;
  }

  return { latitude, longitude };
}
