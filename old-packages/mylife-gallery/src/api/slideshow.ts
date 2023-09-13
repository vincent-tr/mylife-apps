import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'slideshow'
};

export const notifySlideshow = [ base, (session, message) => {
  const { id } = message;
  return business.slideshowNotify(session, id);
} ];

export const notifySlideshows = [ base, (session/*, message*/) => {
  return business.slideshowsNotify(session);
} ];

export const notifySlideshowsImages = [ base, (session, message) => {
  const { criteria } = message;
  return business.slideshowsImagesNotify(session, criteria);
} ];

export const createSlideshow = [ base, (session, message) => {
  const { values } = message;
  return business.slideshowCreate(values);
} ];

export const deleteSlideshow = [ base, (session, message) => {
  const { id } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowDelete(slideshow);
} ];

export const updateSlideshow = [ base, (session, message) => {
  const { id, values } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowUpdate(slideshow, values);
} ];

export const addAlbumToSlideshow = [ base, (session, message) => {
  const { id, albumId } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowAddAlbum(slideshow, albumId);
} ];

export const removeAlbumFromSlideshow = [ base, (session, message) => {
  const { id, albumId } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowRemoveAlbum(slideshow, albumId);
} ];

export const moveAlbumInSlideshow = [ base, (session, message) => {
  const { id, oldIndex, newIndex } = message;
  const slideshow = business.slideshowGet(id);
  return business.slideshowMoveAlbum(slideshow, oldIndex, newIndex);
} ];
