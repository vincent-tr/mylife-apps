import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'document'
};

export const notifyDocumentWithInfo = [ base, (session, message) => {
  const { type, id } = message;
  return business.documentWithInfoNotify(session, type, id);
} ];

export const notifyDocumentsWithInfo = [ base, (session, message) => {
  const { criteria } = message;
  return business.documentsWithInfoNotify(session, criteria);
} ];

export const updateDocument = [ base, (session, message) => {
  const { type, id, values } = message;
  const document = business.documentGet(type, id);
  return business.documentUpdate(document, values);
} ];

export const addPersonToDocument = [ base, (session, message) => {
  const { type, id, personId } = message;
  const document = business.documentGet(type, id);
  const person = business.personGet(personId);
  return business.documentAddPerson(document, person);
} ];

export const removePersonToDocument = [ base, (session, message) => {
  const { type, id, personId } = message;
  const document = business.documentGet(type, id);
  const person = business.personGet(personId);
  return business.documentRemovePerson(document, person);
} ];

export const addKeywordToDocument = [ base, (session, message) => {
  const { type, id, keyword } = message;
  const document = business.documentGet(type, id);
  return business.documentAddKeyword(document, keyword);
} ];

export const removeKeywordToDocument = [ base, (session, message) => {
  const { type, id, keyword } = message;
  const document = business.documentGet(type, id);
  return business.documentRemoveKeyword(document, keyword);
} ];
