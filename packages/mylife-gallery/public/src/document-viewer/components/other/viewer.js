'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import DetailItem from '../common/detail-item';
import DocumentValue from '../common/document-value';

// viewer can only show details
const OtherViewer = ({ documentWithInfo, ...props }) => (
  <mui.List {...props}>
    <DocumentValue documentWithInfo={documentWithInfo} field='caption' />
    <DocumentValue documentWithInfo={documentWithInfo} field='keywords' />
    <DocumentValue documentWithInfo={documentWithInfo} field='albums' />

    <DocumentValue documentWithInfo={documentWithInfo} field='integrationDate' />
    <DocumentValue documentWithInfo={documentWithInfo} field='paths' />
    <DocumentValue documentWithInfo={documentWithInfo} field='fileSize' />
    <DocumentValue documentWithInfo={documentWithInfo} field='hash' />

    <DetailItem name={'Erreur à l\'intégration du fichier'} value={documentWithInfo.document.loadingError} />
  </mui.List>
);

OtherViewer.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
};

export default OtherViewer;
