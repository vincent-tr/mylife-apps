'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'person'
};

exports.notifyPerson = [ base, (session, message) => {
  const { id } = message;
  return business.personNotify(session, id);
} ];

exports.notifyPersons = [ base, (session, message) => {
  const { criteria } = message;
  return business.personsNotify(session, criteria);
} ];

exports.createPersonFromDocuments = [ base, (session, message) => {
  const { firstName, lastName, documents } = message;
  const person = business.personCreateFromDocuments(firstName, lastName, documents);
  return person._id;
} ];

exports.createPerson = [ base, (session, message) => {
  const { values } = message;
  const person = business.personCreate(values);
  return person._id;
} ];

exports.deletePerson = [ base, (session, message) => {
  const { id } = message;
  const person = business.personGet(id);
  return business.personDelete(person);
} ];

exports.updatePerson = [ base, (session, message) => {
  const { id, values } = message;
  const person = business.personGet(id);
  return business.personUpdate(person, values);
} ];
