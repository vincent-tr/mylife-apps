'use strict';

const fs     = require('fs');
const path   = require('path');
const co     = require('co');
const monk   = require('monk');
const coMonk = require('co-monk');
const config = require('../conf/config');
const log4js = require('log4js');
const logger = log4js.getLogger('mylife:wine:migrate_createdb');

const sourceDirectory = path.resolve(__dirname, '../migration/json');

const doStock = !!process.argv.find(arg => arg === '--stock');

const allTables = [
  { name : 'articleDishes', sqlName : 'WineArticleDish' },
  { name : 'articles',      sqlName : 'WineArticle' },
  { name : 'capacities',    sqlName : 'WineBottleCapacity' },
  { name : 'dishes',        sqlName : 'WineDish' },
  { name : 'history',       sqlName : 'WineHistory', stock: true },
  { name : 'regions',       sqlName : 'WineRegion' },
  { name : 'stock',         sqlName : 'WineStock', stock: true },
  { name : 'types',         sqlName : 'WineType' }
];

const allConstraints = [
  //articleDishes
  { table : 'articles', field: 'type',     sqlField : 'typeSqlid',           ref : 'types' },
  { table : 'articles', field: 'region',   sqlField : 'regionSqlid',         ref : 'regions' },
  { table : 'history',  field: 'capacity', sqlField : 'bottleCapacitySqlid', ref : 'capacities' },
  { table : 'history',  field: 'article',  sqlField : 'articleSqlid',        ref : 'articles' },
  { table : 'stock',    field: 'capacity', sqlField : 'bottleCapacitySqlid', ref : 'capacities' },
  { table : 'stock',    field: 'article',  sqlField : 'articleSqlid',        ref : 'articles' }
];

const db = monk(config.mongo);

co(main).then(() => {
  logger.info('Success!');
  db.close();
}, (err) => {
  logger.error(err);
  db.close();
});

function* main() {

  const tables = activeTables();
  const constraints = activeConstraints();

  for(const table of allTables) {
    yield dropTable(table.name);
  }

  for(const table of tables) {
    yield importTable(table);
  }

  for(const constraint of constraints) {
    yield resolveConstraint(constraint);
  }

  yield resolveNNConstraint();

  for(const table of tables) {
    yield removeField(table.name, 'sqlid');
  }

  for(const constraint of constraints) {
    yield removeField(constraint.table, constraint.sqlField);
  }

  yield dropTable('articleDishes');

  db.close();
}

function activeTables() {
  if(doStock) { return allTables; }
  return allTables.filter(table => !table.stock);
}

function activeConstraints() {
  if(doStock) { return allConstraints; }
  return allConstraints.filter(constraint => !allTables.find(table => table.name === constraint.table).stock);
}

function* dropTable(tableName) {
  logger.info(`Dropping ${tableName}`);
  const collection = coMonk(db.get(tableName));
  yield collection.drop();
}

function* importTable(table) {
  logger.info(`Importing ${table.name}`);
  const collection = coMonk(db.get(table.name));
  const records = JSON.parse(fs.readFileSync(path.resolve(sourceDirectory, `dbo.${table.sqlName}.Table.json`), { encoding: 'utf8' }));
  yield collection.insert(records);
}

function* removeField(tableName, field) {
  logger.info(`Removing ${tableName}.${field}`);
  const collection = coMonk(db.get(tableName));
  yield collection.update({}, { $unset: { [field]: null } }, { multi: true });
}

function* resolveConstraint(constraint) {
  logger.info(`Resolving ${constraint.table}.${constraint.sqlField} -> ${constraint.ref}.sqlid`);
  const ref = yield loadPk(constraint.ref);
  const collection = coMonk(db.get(constraint.table));
  const data = yield collection.find({});
  for(const item of data) {
    const value = ref.get(item[constraint.sqlField]);
    yield collection.update({ _id: item._id}, { $set: { [constraint.field]: value } });
  }
}

function* resolveNNConstraint() {
  logger.info(`Resolving articleDishes`);
  const articles = yield loadPk('articles');
  const dishes = yield loadPk('dishes');

  const collection = coMonk(db.get('articles'));

  const data = yield coMonk(db.get('articleDishes')).find({});
  for(const item of data) {
    const dishId = dishes.get(item.dishSqlid);
    const articleId = articles.get(item.articleSqlid);
    yield collection.update({ _id: articleId }, { $addToSet: { dishes : dishId } });
  }
}

function* loadPk(tableName) {
  const collection = coMonk(db.get(tableName));
  const data = yield collection.find({});
  const map = new Map();
  for(const item of data) {
    map.set(item.sqlid, item._id);
  }
  return map;
}