'use strict';

const { xlsx } = require('mylife-tools-server');

exports.exportGroupByMonth = (session, criteria, display) => {
  return newWorkbook();
};

exports.exportGroupByYear = (session, criteria, display) => {
  return newWorkbook();
};

function newWorkbook() {
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.aoa_to_sheet([[]]);
  xlsx.utils.book_append_sheet(workbook, sheet, 'export');
  return xlsx.write(workbook, { type: 'buffer' });
}
