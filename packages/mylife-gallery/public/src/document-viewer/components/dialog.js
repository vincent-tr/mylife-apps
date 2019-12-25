'use strict';

import { React, PropTypes, mui, useMemo, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import DialogContentImage from './image/dialog-content';
import DialogContentVideo from './video/dialog-content';
import DialogContentOther from './other/dialog-content';
import { getDocument } from '../selectors';
import { fetchDocumentView, clearView } from '../actions';

const DialogSelector = ({ document, ...props }) => {
  switch(document._entity) {
    case 'image':
      return (<DialogContentImage document={document} {...props} />);
    case 'video':
      return (<DialogContentVideo document={document} {...props} />);
    case 'other':
      return (<DialogContentOther document={document} {...props} />);
  }
};

DialogSelector.propTypes = {
  document: PropTypes.object.isRequired,
};

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

const DialogContainer = ({ documentType, documentId, onPrev: prev, onNext: next, ...props }) => {
  const { fetchDocumentView, clearView, document } = useConnect();
  const enter = () => fetchDocumentView(documentType, documentId);
  const leave = clearView;
  useLifecycle(enter, leave);

  const onPrev = createViewFetcher(fetchDocumentView, prev);
  const onNext = createViewFetcher(fetchDocumentView, next);

  if(!document) {
    return null;
  }

  return (<DialogSelector document={document} onPrev={onPrev} onNext={onNext} {...props} />);
};

DialogContainer.propTypes = {
  documentType: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
};

function createViewFetcher(fetchDocumentView, documentSelector) {
  if(!documentSelector) {
    return null;
  }

  return () => {
    const { type, id } = documentSelector();
    fetchDocumentView(type, id);
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const Dialog = ({ show, proceed, options }) => (
  <mui.Dialog open={show} onClose={proceed} fullScreen TransitionComponent={Transition}>
    <DialogContainer onClose={proceed} {...options}/>
  </mui.Dialog>
);

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;
