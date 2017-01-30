'use strict';

const monk                 = require('monk');
const config               = require('../conf/config');
const fs                   = require('fs');
const log4js               = require('log4js');
const logger               = log4js.getLogger('mylife:money:import');
const { operationsImport } = require('../lib/cli.js');

const account = process.argv[2];
const file    = process.argv[3];
const data    = fs.readFileSync(file);
const db      = monk(config.mongo);

operationsImport(db, account, data, (err) => {
  if(err) {
    db.close();
    return logger.error(err);
  }

  logger.info("Import successfully executed");
  db.close();
});
