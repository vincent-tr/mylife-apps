import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'suggestion'
};

export const notifySuggestions = [ base, (session/*, message*/) => {
  return business.suggestionsNotify(session);
} ];

export const createAlbum = [ base, (session, message) => {
  const { root } = message;
  return business.suggestionCreateAlbum(root);
} ];

export const cleanOthersList = [ base, (/*session, message*/) => {
  return business.suggestionCleanOthersList();
} ];

export const cleanDuplicatesList = [ base, (/*session, message*/) => {
  return business.suggestionCleanDuplicatesList();
} ];

export const deleteEmptyAlbum = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionDeleteEmptyAlbum(id);
} ];

export const moveSortedDocumentsList = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionMoveSortedDocumentsList(id);
} ];

export const deleteLoadingErrorsList = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionDeleteLoadingErrorsList(id);
} ];

export const deleteLoadingErrors = [ base, async (session, message) => {
  const { documents } = message;
  return business.suggestionDeleteLoadingErrors(documents);
} ];
