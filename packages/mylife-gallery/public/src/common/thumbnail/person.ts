'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import BaseMulti from './base-multi';

const ThumbnailPerson = ({ person, ...props }) => (
  <BaseMulti thumbnails={person.thumbnails} {...props} />
);

ThumbnailPerson.propTypes = {
  person: PropTypes.object.isRequired,
};

export default ThumbnailPerson;
