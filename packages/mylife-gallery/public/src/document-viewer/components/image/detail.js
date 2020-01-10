'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { getFieldName } from '../../../common/metadata-utils';
import DetailItem from '../common/detail-item';
import DetailAdvanced from '../common/detail-advanced';
import DocumentValue from '../common/document-value';
import DetailLocation from './detail-location';

const ImageDetail = ({ open, documentWithInfo, ...props }) => {
  const { document } = documentWithInfo;
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <mui.List {...props}>
        <DocumentValue documentWithInfo={documentWithInfo} field='caption' />
        <DocumentValue documentWithInfo={documentWithInfo} field='keywords' />
        <DetailItem name={getFieldName('image', 'date')} value={document.date} />
        <DocumentValue documentWithInfo={documentWithInfo} field='albums' />
        <DetailItem name={getFieldName('image', 'persons')} value={'TODO document.persons'} />
        <DetailLocation location={getLocation(document)} />
        <DetailItem name='Dimensions' value={`${document.width} x ${document.height}`} />
        <DetailItem name={'Modèle d\'appareil'} value={document.metadata.model} />

        <DetailAdvanced>
          <DocumentValue documentWithInfo={documentWithInfo} field='integrationDate' />
          <DocumentValue documentWithInfo={documentWithInfo} field='paths' />
          <DocumentValue documentWithInfo={documentWithInfo} field='fileSize' />
          <DocumentValue documentWithInfo={documentWithInfo} field='hash' />
          <DetailItem name={getFieldName('image', 'perceptualHash')} value={document.perceptualHash} />
        </DetailAdvanced>
      </mui.List>
    </mui.Slide>
  );
};

ImageDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  documentWithInfo: PropTypes.object.isRequired,
};

export default ImageDetail;

function getLocation(document) {
  const latitude = document.metadata.gpsLatitude;
  const longitude = document.metadata.gpsLongitude;
  if(!latitude || !longitude) {
    return null;
  }

  return { latitude, longitude };
}
