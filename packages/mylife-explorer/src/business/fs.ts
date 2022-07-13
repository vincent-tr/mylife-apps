import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
const { getConfig } = require('mylife-tools-server');

const rootPath = getConfig('root');

interface NodeInfo {
  atime: number;
  mtime: number;
  ctime: number;
  birthtime: number;
  size: number;
  type: string;
}

interface FileInfo extends NodeInfo {
  mime: string;
}

interface DirectoryInfo extends NodeInfo {
  content: ({ name: string; } & NodeInfo)[];
}

export async function metadata(p: string) {
  const fullPath = getFullPath(p);
  const result = await infos(fullPath);

  switch (result.type) {
    case 'Directory': {
      const directory = result as DirectoryInfo;

      const names = await fs.promises.readdir(fullPath);
      directory.content = [];
      const list = directory.content;
      for (const name of names) {
        if (name.startsWith('.')) {
          continue;
        }

        list.push({
          name,
          ... await infos(path.join(fullPath, name))
        });
      }
      break;
    }
  }

  return result;
}

export async function getInfos(p: string) {
  const fullPath = getFullPath(p);
  return await infos(fullPath);
}

export function createReadStream(p: string, options) {
  const fullPath = getFullPath(p);
  return fs.createReadStream(fullPath, options);
}

function getFullPath(relative: string) {
  if (relative) {
    return path.join(rootPath, relative);
  } else {
    return rootPath;
  }
}

async function infos(fullPath: string) {
  const stats = await fs.promises.lstat(fullPath);

  const result: NodeInfo = {
    atime: stats.atimeMs,
    mtime: stats.mtimeMs,
    ctime: stats.ctimeMs,
    birthtime: stats.birthtimeMs,
    size: stats.size,
    type: entryType(stats)
  };

  switch (result.type) {
    case 'File': {
      const file = result as FileInfo;

      const { ext } = path.parse(fullPath);
      file.mime = mime.lookup(ext);
      break;
    }
  }

  return result;
}

function entryType(stats) {
  if (stats.isBlockDevice()) { return 'BlockDevice'; }
  if (stats.isCharacterDevice()) { return 'CharacterDevice'; }
  if (stats.isDirectory()) { return 'Directory'; }
  if (stats.isFIFO()) { return 'FIFO'; }
  if (stats.isFile()) { return 'File'; }
  if (stats.isSocket()) { return 'Socket'; }
  if (stats.isSymbolicLink()) { return 'SymbolicLink'; }
  return 'Unknown';
}