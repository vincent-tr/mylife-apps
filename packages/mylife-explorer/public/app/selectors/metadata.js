'use strict';

export const getMetadataPath    = state => state.metadata && state.metadata.path;
export const getMetadataType    = state => state.metadata && state.metadata.type;
export const getMetadataNodes   = state => state.metadata && state.metadata.nodes;
export const getMetadataContent = state => state.metadata && state.metadata.content;