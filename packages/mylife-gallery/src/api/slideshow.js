'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'slideshow'
};

exports.notifySlideshow = [ base, (session, message) => {
  const { id } = message;
  return business.slideshowNotify(session, id);
} ];

exports.notifySlideshows = [ base, (session/*, message*/) => {
  return business.slideshowsNotify(session);
} ];

exports.notifySlideshowsImages = [ base, (session, message) => {
  const { criteria } = message;
  return business.slideshowsImagesNotify(session, criteria);
} ];

exports.createSlideshow = [ base, (session, message) => {
  const { values } = message;
  return business.slideshowCreate(values);
} ];

exports.deleteSlideshow = [ base, (session, message) => {
  const { id } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowDelete(slideshow);
} ];

exports.updateSlideshow = [ base, (session, message) => {
  const { id, values } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowUpdate(slideshow, values);
} ];

exports.addAlbumToSlideshow = [ base, (session, message) => {
  const { id, albumId } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowAddAlbum(slideshow, albumId);
} ];

exports.removeAlbumFromSlideshow = [ base, (session, message) => {
  const { id, albumId } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowRemoveAlbum(slideshow, albumId);
} ];

exports.moveAlbumInSlideshow = [ base, (session, message) => {
  const { id, oldIndex, newIndex } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowMoveAlbum(slideshow, oldIndex, newIndex);
} ];
