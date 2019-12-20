'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import DetailItem from './detail-item';

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
      return (<DetailItem name='Titre' value={document.caption} />);
    case 'keywords':
      return (<DetailItem name='Mots clés' value={document.keywords} />);
    default:
      throw new Error(`Unknown document field: '${field}'`);
  }
};

DocumentValue.propTypes = {
  document: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
};

export default DocumentValue;
