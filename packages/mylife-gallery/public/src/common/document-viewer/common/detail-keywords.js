'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import DetailItem from './detail-item';

const DetailKeywords = ({ document }) => (
  <DetailItem name='Mots clés' value={document.keywords} />
);

DetailKeywords.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailKeywords;
