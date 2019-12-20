'use strict';

export const DOCUMENT_TYPES = [
  { id: 'image', text: 'Image' },
  { id: 'video', text: 'Vidéo' },
  { id: 'other', text: 'Autre' }
];

export const DOCUMENT_TYPE_MAP = new Map(DOCUMENT_TYPES.map(type => [type.id, type.text]));

export function getInfo(document) {
  return {
    contentUrl: getContentUrl(document),
    title: getTitle(document),
    subtitle: getSubtitle(document)
  };
}

function getContentUrl(document) {
  switch(document._entity) {
    case 'image':
      return `/content/image/${document._id}`;
    case 'video':
      return `/content/video/${document._id}`;
    case 'other':
    default:
      return null;
  }

}

function getTitle(document) {
  if(document.caption) {
    return document.caption;
  }
  const path = document.paths[0].path;
  const fileName = path.replace(/^.*[\\/]/, '');
  return fileName;
}

function getSubtitle(document) {
  if(document.keywords.length) {
    return document.keywords.join(' ');
  }

  return document.paths[0].path;
}
