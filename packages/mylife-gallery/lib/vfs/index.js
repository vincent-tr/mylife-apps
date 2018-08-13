'use strict';

const driverArray = [
  require('./local')
];

const drivers = {};

for(const driver of driverArray) {
  drivers[driver.type] = driver;
}

class FSEntry {
  constructor(driver, path) {
    this._driver = driver;
    this._path = path;
  }

  static async load(fullPath) {
    const index = fullPath.indexOf(':');
    if(index === -1) {
      throw new Error(`Bad path '${fullPath}'`);
    }
    const driverType = fullPath.substring(0, index);
    const path = fullPath.substring(index + 1);
    const driver = drivers[driverType];
    if(!driver) {
      throw new Error(`Unknown driver '${driverType}'`);
    }

    return await FSEntry._load(driver, path);
  }

  static async _load(driver, path) {
    const type = await driver.entryType(path);

    switch(type) {
      case 'directory':
        return new Directory(driver, path);

      case 'file':
        return new File(driver, path);

      default:
        throw new Error(`Unknown entry type : '${type}'`);
    }
  }

  get path() {
    return this._driver.formatPath(this._path);
  }

  get name() {
    return this._driver.formatName(this._path);
  }

  get ext() {
    return this._driver.formatExt(this._path);
  }

  toJSON() {
    return {
      driver : this._driver.type,
      path   : this._path
    };
  }
}

class Directory extends FSEntry {
  constructor(driver, path) {
    super(driver, path);
  }

  async list() {
    const paths = await this._driver.directoryList(this._path);
    const entries = [];
    for(const path of paths) {
      entries.push(await FSEntry._load(this._driver, path));
    }
    return entries;
  }
}

class File extends FSEntry {
  constructor(driver, path) {
    super(driver, path);
  }

  async size() {
    return await this._driver.fileSize(this._path);
  }

  async content() {
    return await this._driver.fileContent(this._path);
  }
}

exports.FSEntry   = FSEntry;
exports.Directory = Directory;
exports.File      = File;
