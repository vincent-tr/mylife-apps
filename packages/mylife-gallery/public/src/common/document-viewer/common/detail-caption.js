'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField } from 'mylife-tools-ui';
import { updateDocument } from '../actions';
import { getFieldName } from '../../metadata-utils';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateDocument : (document, values) => dispatch(updateDocument(document, values)),
  }), [dispatch]);
};

const DetailCaption = ({ document }) => {
  const { updateDocument } = useConnect();
  const onChanged = value => updateDocument(document, { caption: value });

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{getFieldName('document', 'caption')}</mui.Typography>
        }
        secondary={
          <DebouncedTextField value={document.caption} onChange={onChanged} />
        } />
    </mui.ListItem>
  );
};

DetailCaption.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailCaption;
