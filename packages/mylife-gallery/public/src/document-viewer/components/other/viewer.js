'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import DetailItem from '../common/detail-item';
import DocumentValue from '../common/document-value';

// viewer can only show details
const OtherViewer = ({ document, ...props }) => (
  <mui.List {...props}>
    <DocumentValue document={document} field='caption' />
    <DocumentValue document={document} field='keywords' />

    <DocumentValue document={document} field='integrationDate' />
    <DocumentValue document={document} field='paths' />
    <DocumentValue document={document} field='fileSize' />
    <DocumentValue document={document} field='hash' />

    <DetailItem name={'Erreur à l\'intégration du fichier'} value={document.loadingError} />
  </mui.List>
);

OtherViewer.propTypes = {
  document: PropTypes.object.isRequired,
};

export default OtherViewer;
