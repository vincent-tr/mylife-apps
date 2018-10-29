'use strict';

const fs = require('fs').promises;
const path = require('path');
const { albums, images, thumbnails } = require('../repository');
const config = require('../../conf/config');

const debug = require('debug')('mylife:gallery:sync:images');

exports.diff = async function diff(album) {

};