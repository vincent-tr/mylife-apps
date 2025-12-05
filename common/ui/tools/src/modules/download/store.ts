import { createAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../services/store-api';
import { FileData } from './types';

const ACTION_DOWNLOAD_FILE = `${STATE_PREFIX}/download/file`;

export const file = createAction<FileData>(ACTION_DOWNLOAD_FILE);

const toBase64 = (array) => btoa(String.fromCharCode.apply(null, array));

const download = (name, link) => {
  const pom = document.createElement('a');
  document.body.appendChild(pom); //required in FF, optional for Chrome
  pom.setAttribute('href', link);
  pom.setAttribute('download', name);
  pom.click();
  pom.remove();
};

export const middleware = (/*store*/) => (next) => (action) => {
  if (action.type === ACTION_DOWNLOAD_FILE) {
    const { name, mime, content } = action.payload;
    download(name, `data:${mime};base64,${toBase64(content)}`);
  }

  return next(action);
};
