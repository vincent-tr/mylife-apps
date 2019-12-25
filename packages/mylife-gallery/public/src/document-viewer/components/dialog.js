'use strict';

import { React, PropTypes, mui, useMemo, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import DialogContentImage from './image/dialog-content';
import DialogContentVideo from './video/dialog-content';
import DialogContentOther from './other/dialog-content';
import { getDocument } from '../selectors';
import { fetchDocumentView, clearView } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      document: getDocument(state)
    })),
    ...useMemo(() => ({
      fetchDocumentView : (type, id) => dispatch(fetchDocumentView(type, id)),
      clearView : () => dispatch(clearView()),
    }), [dispatch])
  };
};

const DialogContent = ({ documentType, documentId, ...props }) => {
  const { fetchDocumentView, clearView, document } = useConnect();
  const enter = () => fetchDocumentView(documentType, documentId);
  const leave = clearView;
  useLifecycle(enter, leave);

  if(!document) {
    return null;
  }

  switch(document._entity) {
    case 'image':
      return (<DialogContentImage document={document} {...props} />);
    case 'video':
      return (<DialogContentVideo document={document} {...props} />);
    case 'other':
      return (<DialogContentOther document={document} {...props} />);
  }
};

DialogContent.propTypes = {
  documentType: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const Dialog = ({ show, proceed, options }) => {
  const { documentType, documentId } = options;
  return (
    <mui.Dialog open={show} onClose={proceed} fullScreen TransitionComponent={Transition}>
      <DialogContent documentType={documentType} documentId={documentId} onClose={proceed} />
    </mui.Dialog>
  );
};

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;
