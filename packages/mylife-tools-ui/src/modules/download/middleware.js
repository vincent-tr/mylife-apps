'use strict';

import actionTypes from './action-types';

const toBase64 = array => btoa(String.fromCharCode.apply(null, array));

const download = (name, link) => {
  const pom = document.createElement('a');
  document.body.appendChild(pom); //required in FF, optional for Chrome
  pom.setAttribute('href', link);
  pom.setAttribute('download', name);
  pom.click();
  pom.remove();
};

export default (/*store*/) => next => action => {

  if(action.type === actionTypes.FILE) {
    const { name, mime, content } = action.payload;
    download(name, `data:${mime};base64,${toBase64(content)}`);
  }

  return next(action);
};
