'use strict';

const monk                = require('monk');
const config              = require('../conf/config');
const fs                  = require('fs');
const log4js              = require('log4js');
const logger              = log4js.getLogger('mylife:money:import');
const { operationsImport} = require('../lib/importer.js');

const file = process.argv[2];
const data = fs.readFileSync(file);
const db   = monk(config.mongo);

operationsImport(db, data, (err) => {
  if(err) { return logger.error(err); }

  logger.info("Import successfully executed");
  db.close();
});
