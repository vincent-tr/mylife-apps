'use strict';

// https://lollyrock.com/posts/nodejs-encryption/

const crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const PASSWORD = 'YZQwMLVZM6H5WAHrfh97';

exports.passwordEncrypt = text => {
  const cipher = crypto.createCipher(ALGORITHM, PASSWORD);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.passwordDecrypt = crypted => {
  const decipher = crypto.createDecipher(ALGORITHM, PASSWORD);
  let text = decipher.update(crypted, 'hex', 'utf8');
  text += decipher.final('utf8');
  return text;
};
