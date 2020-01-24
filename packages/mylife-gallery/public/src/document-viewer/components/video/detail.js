'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { getFieldName } from '../../../common/metadata-utils';
import DetailItem from '../common/detail-item';
import DetailAdvanced from '../common/detail-advanced';
import DocumentValue from '../common/document-value';

const VideoDetail = ({ open, documentWithInfo, ...props }) => {
  const { document } = documentWithInfo;
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <mui.List {...props}>
        <DocumentValue documentWithInfo={documentWithInfo} field='caption' />
        <DocumentValue documentWithInfo={documentWithInfo} field='keywords' />
        <DocumentValue documentWithInfo={documentWithInfo} field='date' />
        <DocumentValue documentWithInfo={documentWithInfo} field='albums' />
        <DocumentValue documentWithInfo={documentWithInfo} field='persons' />
        <DetailItem name={getFieldName('video', 'duration')} value={document.duration} type='duration' />
        <DetailItem name='Dimensions' value={`${document.width} x ${document.height}`} />

        <DetailAdvanced>
          <DocumentValue documentWithInfo={documentWithInfo} field='integrationDate' />
          <DocumentValue documentWithInfo={documentWithInfo} field='paths' />
          <DocumentValue documentWithInfo={documentWithInfo} field='fileSize' />
          <DocumentValue documentWithInfo={documentWithInfo} field='hash' />
        </DetailAdvanced>
      </mui.List>
    </mui.Slide>
  );
};

VideoDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  documentWithInfo: PropTypes.object.isRequired
};

export default VideoDetail;
