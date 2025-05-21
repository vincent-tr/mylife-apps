import deepFreeze from 'deep-freeze';

let defines;

export function init(values) {
  defines = values;
  deepFreeze(defines);
}

export function getDefines() {
  return defines;
}

export function getDefine(name: string) {
  const value = defines[name];
  if (value === undefined) {
    throw new Error(`Missing define : ${name}`);
  }
  return value;
}
