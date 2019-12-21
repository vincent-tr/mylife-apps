'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { getFieldName } from '../../metadata-utils';
import DetailItem from './detail-item';

const DetailKeywords = ({ document }) => (
  <DetailItem name={getFieldName('document', 'keywords')} value={document.keywords} />
);

DetailKeywords.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailKeywords;
