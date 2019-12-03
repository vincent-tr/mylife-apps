'use strict';

export const DOCUMENT_TYPES = [
  { id: 'image', text: 'Image' },
  { id: 'video', text: 'Vidéo' },
  { id: 'other', text: 'Autre' }
];

export const DOCUMENT_TYPE_MAP = new Map(DOCUMENT_TYPES.map(type => [type.id, type.text]));
