import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField, services } from 'mylife-tools-ui';
import { updateDocument } from '../../actions';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
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
          <mui.Typography>{services.getFieldName('document', 'caption')}</mui.Typography>
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
