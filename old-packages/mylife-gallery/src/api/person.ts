import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'person'
};

export const notifyPerson = [ base, (session, message) => {
  const { id } = message;
  return business.personNotify(session, id);
} ];

export const notifyPersons = [ base, (session, message) => {
  const { criteria } = message;
  return business.personsNotify(session, criteria);
} ];

export const createPersonFromDocuments = [ base, (session, message) => {
  const { firstName, lastName, documents } = message;
  const person = business.personCreateFromDocuments(firstName, lastName, documents);
  return person._id;
} ];

export const createPerson = [ base, (session, message) => {
  const { values } = message;
  const person = business.personCreate(values);
  return person._id;
} ];

export const deletePerson = [ base, (session, message) => {
  const { id } = message;
  const person = business.personGet(id);
  return business.personDelete(person);
} ];

export const updatePerson = [ base, (session, message) => {
  const { id, values } = message;
  const person = business.personGet(id);
  return business.personUpdate(person, values);
} ];
