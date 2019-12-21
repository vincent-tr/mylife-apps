'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import DetailItem from './detail-item';

const DetailCaption = ({ document }) => (
  <DetailItem name='Titre' value={document.caption} />
);

DetailCaption.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailCaption;
