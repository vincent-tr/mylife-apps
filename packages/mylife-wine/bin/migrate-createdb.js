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

const tables = {
  //articleDishes : {},
  articles   : { sqlName: 'WineArticle' },
  capacities : { sqlName: 'WineBottleCapacity' },
  dishes     : { sqlName: 'WineDish' },
  history    : { sqlName: 'WineHistory' },
  regions    : { sqlName: 'WineRegion' },
  stock      : { sqlName: 'WineStock' },
  types      : { sqlName: 'WineType' }
};

const db = monk(config.mongo);

co(main).then(() => {
  logger.info('Success!');
  db.close();
}, (err) => {
  logger.error(err);
  db.close();
});

function* main() {

  for(const name of Object.keys(tables)) {
    yield cleanTable(name);
  }

  for(const name of Object.keys(tables)) {
    yield importTable(name);
  }

  db.close();
}

function* cleanTable(name) {
  logger.info(`Cleaning ${name}`);
  const collection = coMonk(db.get(name));
  yield collection.drop();
}

function* importTable(name) {
  logger.info(`Importing ${name}`);
  const table = tables[name];
  const collection = coMonk(db.get(name));
  const records = JSON.parse(fs.readFileSync(path.resolve(sourceDirectory, `dbo.${table.sqlName}.Table.json`), { encoding: 'utf8' }));
  yield collection.insert(records);
}
