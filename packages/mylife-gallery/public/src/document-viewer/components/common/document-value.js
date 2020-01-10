'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { getFieldName } from '../../../common/metadata-utils';
import DetailItem from './detail-item';
import DetailCaption from './detail-caption';
import DetailKeywords from './detail-keywords';
import DetailAlbums from './detail-albums';

const DocumentValue = ({ documentWithInfo, field }) => {
  const { document } = documentWithInfo;
  switch(field) {
    case 'hash':
      return (<DetailItem name={getFieldName('document', 'hash')} value={document.hash} />);
    case 'paths':
      return (<DetailItem name={getFieldName('document', 'paths')} value={document.paths.map(item => item.path)} />);
    case 'integrationDate':
      return (<DetailItem name={getFieldName('document', 'integrationDate')} value={document.integrationDate} />);
    case 'fileSize':
      return (<DetailItem name={getFieldName('document', 'fileSize')} value={document.fileSize} type='filesize' />);
    case 'caption':
      return (<DetailCaption document={document} />);
    case 'keywords':
      return (<DetailKeywords document={document} />);
    case 'albums':
      return (<DetailAlbums documentWithInfo={documentWithInfo} />);
    default:
      throw new Error(`Unknown document field: '${field}'`);
  }
};

DocumentValue.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
};

export default DocumentValue;
