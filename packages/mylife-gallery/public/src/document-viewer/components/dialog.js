'use strict';

import { React, PropTypes, useMemo, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import FullScreenDialog from '../../common/fullscreen-dialog';
import DialogContentImage from './image/dialog-content';
import DialogContentVideo from './video/dialog-content';
import DialogContentOther from './other/dialog-content';
import { getDocument } from '../selectors';
import { fetchDocumentView, clearDocumentView } from '../actions';

const DialogSelector = ({ documentWithInfo, ...props }) => {
  switch(documentWithInfo.document._entity) {
    case 'image':
      return (<DialogContentImage documentWithInfo={documentWithInfo} {...props} />);
    case 'video':
      return (<DialogContentVideo documentWithInfo={documentWithInfo} {...props} />);
    case 'other':
      return (<DialogContentOther documentWithInfo={documentWithInfo} {...props} />);
  }
};

DialogSelector.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
};

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documentWithInfo: getDocument(state)
    })),
    ...useMemo(() => ({
      fetchDocumentView : (type, id) => dispatch(fetchDocumentView(type, id)),
      clearView : () => dispatch(clearDocumentView()),
    }), [dispatch])
  };
};

const DialogContainer = ({ documentType, documentId, onPrev: prev, onNext: next, canPrev, canNext, ...props }) => {
  const { fetchDocumentView, clearView, documentWithInfo } = useConnect();
  const enter = () => fetchDocumentView(documentType, documentId);
  const leave = clearView;
  useLifecycle(enter, leave);

  const onPrev = createViewFetcher(fetchDocumentView, prev, canPrev);
  const onNext = createViewFetcher(fetchDocumentView, next, canNext);

  if(!documentWithInfo) {
    return null;
  }

  return (<DialogSelector documentWithInfo={documentWithInfo} onPrev={onPrev} onNext={onNext} {...props} />);
};

DialogContainer.propTypes = {
  documentType: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  canPrev: PropTypes.func,
  canNext: PropTypes.func,
};

function createViewFetcher(fetchDocumentView, documentSelector, checkEnabled) {
  if(!documentSelector || !checkEnabled) {
    return null;
  }

  if(!checkEnabled()) {
    return null;
  }

  return () => {
    const { type, id } = documentSelector();
    fetchDocumentView(type, id);
  };
}

const Dialog = ({ show, proceed, options }) => (
  <FullScreenDialog open={show} onClose={proceed}>
    <DialogContainer onClose={proceed} {...options}/>
  </FullScreenDialog>
);

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;
