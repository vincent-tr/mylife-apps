'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import DetailItem from './detail-item';
import DetailCaption from './detail-caption';
import DetailKeywords from './detail-keywords';

const DocumentValue = ({ document, field }) => {
  switch(field) {
    case 'hash':
      return (<DetailItem name='Hash du fichier' value={document.hash} />);
    case 'paths':
      return (<DetailItem name='Chemins du fichier' value={document.paths.map(item => item.path)} />);
    case 'integrationDate':
      return (<DetailItem name={'Date d\'intégration'} value={document.integrationDate} />);
    case 'fileSize':
      return (<DetailItem name='Taille du fichier' value={document.fileSize} type='filesize' />);
    case 'caption':
      return (<DetailCaption document={document} />);
    case 'keywords':
      return (<DetailKeywords document={document} />);
    default:
      throw new Error(`Unknown document field: '${field}'`);
  }
};

DocumentValue.propTypes = {
  document: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
};

export default DocumentValue;
