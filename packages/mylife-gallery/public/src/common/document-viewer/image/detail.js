'use strict';

import { React, PropTypes, mui, formatDate as formatDateImpl } from 'mylife-tools-ui';
import humanize from 'humanize';
import DetailItem from '../common/detail-item';
import DocumentValue from '../common/document-value';

const ImageDetail = ({ open, document, info, ...props }) => {
  void info;
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <mui.List {...props}>
        <DocumentValue document={document} field='hash' />
        <DocumentValue document={document} field='paths' />
        <DocumentValue document={document} field='integrationDate' />
        <DocumentValue document={document} field='fileSize' />
        <DocumentValue document={document} field='caption' />
        <DocumentValue document={document} field='keywords' />

        <DetailItem name='Hash de perception' value={document.perceptualHash} />
        <DetailItem name={'Modèle d\'appareil'} value={document.metadata.model} />
        <DetailItem name='Localisation' value={`TODO ${document.metadata.gpsLatitude} ${document.metadata.gpsLongitude}`} />
        <DetailItem name={'Dimensions de l\'image'} value={`${document.width} x ${document.height}`} />
        <DetailItem name='Date de prise de photo' value={formatDate(document.date)} />
        <DetailItem name='Personnes' value={'TODO document.persons'} />
        <DetailItem name='Albums' value={'TODO'} />
      </mui.List>
    </mui.Slide>
  );
};

ImageDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default ImageDetail;

function formatDate(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDateImpl(date, 'dd/MM/yyyy');
}

function addLineBreaks(values) {
  return values.map((text, index) => (
    <React.Fragment key={index}>
      {text}
      {index < values.length -1 && (
        <br />
      )}
    </React.Fragment>
  ));
}
