'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { getFieldName } from '../../metadata-utils';
import DetailItem from '../common/detail-item';
import DetailAdvanced from '../common/detail-advanced';
import DocumentValue from '../common/document-value';

const VideoDetail = ({ open, document, ...props }) => {
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <mui.List {...props}>
        <DocumentValue document={document} field='caption' />
        <DocumentValue document={document} field='keywords' />
        <DetailItem name='Date de prise' value={document.date} />
        <DetailItem name='Albums' value={'TODO'} />
        <DetailItem name={getFieldName('video', 'persons')} value={'TODO document.persons'} />
        <DetailItem name={getFieldName('video', 'duration')} value={document.duration} type='duration' />
        <DetailItem name='Dimensions' value={`${document.width} x ${document.height}`} />

        <DetailAdvanced>
          <DocumentValue document={document} field='integrationDate' />
          <DocumentValue document={document} field='paths' />
          <DocumentValue document={document} field='fileSize' />
          <DocumentValue document={document} field='hash' />
        </DetailAdvanced>
      </mui.List>
    </mui.Slide>
  );
};

VideoDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default VideoDetail;
