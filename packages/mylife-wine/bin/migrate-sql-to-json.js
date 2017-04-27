'use strict';

const fs        = require('fs');
const path      = require('path');
const iconvlite = require('iconv-lite');
const readline  = require('readline');
const conv      = require('binstring');

main();

function main() {

  const sourceDirectory = path.resolve(__dirname, '../migration/data');
  const destDirectory   = path.resolve(__dirname, '../migration/json');

  for(const name of fs.readdirSync(sourceDirectory)) {
    const source       = path.resolve(sourceDirectory, name);
    const parsedPath = path.parse(source);
    if(parsedPath.ext.toLowerCase() !== '.sql') { continue; }

    parsedPath.base = null;
    parsedPath.ext = '.json';
    parsedPath.dir = destDirectory;

    const dest = path.format(parsedPath);

    console.log('processing', parsedPath.name);
    processFile(source, dest);
  }
}

function processFile(source, dest) {
  const sourceContent = iconvlite.decode(fs.readFileSync(source), 'utf16');
  const lines = sourceContent.split('\r\n').filter(line => line.startsWith('INSERT'));
  const result = [];

  for(let line of lines) {
    line = line.replace(/\[/g, '').replace(/\]/g, '');
    let [ names, values ] = line.split(') VALUES (');
    const tableName = names.substr(11).split(' ')[0];
    names = names.split('(')[1].split(', ');
    values = values.substr(0, values.length - 1).split(', ');

    const row = {};
    for(let i=0; i<names.length; ++i) {
      row[formatName(tableName, names[i])] = formatValue(values[i]);
    }

    result.push(row);
  }

  fs.writeFileSync(dest, JSON.stringify(result, null, 2));
}

function formatName(tableName, name) {
  if(tableName.startsWith('Wine')) {
    tableName = tableName.substr(4);
  }

  name = name.replace(/ID/g, 'Sqlid');

  if(name.startsWith(tableName)) {
    name = name.substr(tableName.length);
  }
  name = name.toLowerCase()[0] + name.substr(1);
  return name;
}

function formatValue(value) {
  if(value === 'NULL') {
    return null;
  }

  if(value.startsWith('N\'')) {
    return value.substr(2, value.length - 3);
  }

  if(value.endsWith(' AS DateTime)')) {
    return Date.parse(value.split('\'')[1]);
  }

  if(value.startsWith('0x')) {
    const buffer = conv(value.substr(2), { in: 'hex', out: 'buffer'});
    return buffer.toString('base64');
  }

  let nb = Number.parseFloat(value);
  if(!isNaN(nb)) {
    return nb;
  }

  return value;
}