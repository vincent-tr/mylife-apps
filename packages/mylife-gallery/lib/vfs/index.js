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

  get base() {
    return this._driver.formatBase(this._path);
  }

  get name() {
    return this._driver.formatName(this._path);
  }

  get ext() {
    return this._driver.formatExt(this._path);
  }

  get fullPath() {
    return `${this._driver.type}:${this._path}`;
  }

  toJSON() {
    return this.fullPath;
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

  async ensureDirectory(name) {
    const path = await this._driver.ensureDirectory(this._path, name);
    return new Directory(this._driver, path);
  }

  async writeFile(name, content) {
    const path = await this._driver.writeFile(this._path, name, content);
    return new File(this._driver, path);
  }

  async deleteFile(name) {
    await this._driver.deleteFile(this._path, name);
  }
}

class File extends FSEntry {
  constructor(driver, path) {
    super(driver, path);
  }

  async size() {
    return await this._driver.fileSize(this._path);
  }

  async lastModified() {
    return await this._driver.fileLastModified(this._path);
  }

  async content() {
    return await this._driver.fileContent(this._path);
  }
}

exports.FSEntry   = FSEntry;
exports.Directory = Directory;
exports.File      = File;
