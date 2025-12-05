import { createAction, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX, ToolsDispatch, ToolsState } from '../../services/store-api';
import { FileData } from './types';

const ACTION_DOWNLOAD_FILE = `${STATE_PREFIX}/download/file`;

export const file = createAction<FileData>(ACTION_DOWNLOAD_FILE);

export const middleware: Middleware<{}, ToolsState, ToolsDispatch> = (_store) => (next) => (action: PayloadAction<unknown>) => {
  if (action.type === ACTION_DOWNLOAD_FILE) {
    const { name, mime, content } = action.payload as FileData;
    download(name, `data:${mime};base64,${toBase64(content)}`);
  }

  return next(action);
};

function toBase64(array: Uint8Array) {
  return btoa(String.fromCharCode.apply(null, array));
}

function download(name: string, link: string) {
  const pom = document.createElement('a');
  document.body.appendChild(pom); //required in FF, optional for Chrome
  pom.setAttribute('href', link);
  pom.setAttribute('download', name);
  pom.click();
  pom.remove();
};
