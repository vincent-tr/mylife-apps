'use strict';

export const getMetadataPath    = state => state.metadata && state.metadata.path;
export const getMetadataType    = state => state.metadata && state.metadata.type;
export const getMetadataMime    = state => state.metadata && state.metadata.mime;
export const getMetadataNodes   = state => state.metadata && state.metadata.nodes;
export const getMetadataContent = state => state.metadata && sortContent(state.metadata.content);

function sortContent(content) {
  if(!content) {
    return content;
  }

  const result = [ ... content ];
  result.sort(contentComparer);
  return result;
}

function contentComparer(a, b) {
  if(a.type !== 'Directory' && b.type === 'Directory') {
    return 1;
  }
  if(a.type === 'Directory' && b.type !== 'Directory') {
    return -1;
  }

  if(a.name < b.name) {
    return -1;
  }
  if(a.name > b.name) {
    return 1;
  }

  return 0;
}