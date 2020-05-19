'use strict';

import { React, PropTypes, services } from 'mylife-tools-ui';
import DetailItem from './detail-item';
import DetailCaption from './detail-caption';
import DetailKeywords from './detail-keywords';
import DetailDate from './detail-date';
import DetailAlbums from './detail-albums';
import DetailPersons from './detail-persons';

const DocumentValue = ({ documentWithInfo, field }) => {
  const { document } = documentWithInfo;
  switch(field) {
    case 'hash':
      return (<DetailItem name={services.getFieldName('document', 'hash')} value={document.hash} />);
    case 'paths':
      return (<DetailItem name={services.getFieldName('document', 'paths')} value={document.paths.map(item => item.path)} />);
    case 'integrationDate':
      return (<DetailItem name={services.getFieldName('document', 'integrationDate')} value={document.integrationDate} />);
    case 'fileSize':
      return (<DetailItem name={services.getFieldName('document', 'fileSize')} value={document.fileSize} type='filesize' />);
    case 'caption':
      return (<DetailCaption document={document} />);
    case 'keywords':
      return (<DetailKeywords document={document} />);
    case 'date':
      return (<DetailDate document={document} />);
    case 'albums':
      return (<DetailAlbums documentWithInfo={documentWithInfo} />);
    case 'persons':
      return (<DetailPersons documentWithInfo={documentWithInfo} />);
    default:
      throw new Error(`Unknown document field: '${field}'`);
  }
};

DocumentValue.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
};

export default DocumentValue;
