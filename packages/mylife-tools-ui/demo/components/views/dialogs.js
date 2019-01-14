'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { components, modules } from 'mylife-tools-ui';

const { busySet, infoShow, showDialog, Dialog } = modules.dialogs;

const CustomQuestion = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={<h3>Custom title</h3>}
    actions={[
      <components.Button key='ok' primary onClick={() => onClose('ok')}>Ok</components.Button>,
      <components.Button key='cancel' secondary onClick={() => onClose('cancel')}>Annuler</components.Button>
    ]}>
    {'Custom text'}
  </Dialog>
);

CustomQuestion.propTypes = {
  open: Dialog.propTypes.open,
  onClose: Dialog.propTypes.onClose
};

const CustomAnswer = ({ open, onClose, value }) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={<h3>Custom title</h3>}
    actions={[
      <components.Button key='ok' primary onClick={() => onClose('ok')}>Ok</components.Button>
    ]}>
    {`Answer : ${value}`}
  </Dialog>
);

CustomAnswer.propTypes = {
  open: Dialog.propTypes.open,
  onClose: Dialog.propTypes.onClose,
  value: PropTypes.string.isRequired
};

async function customDialogs() {
  const value = await showDialog(CustomQuestion);
  showDialog(CustomAnswer, { value });
}

const Dialogs = ({ errorClick, busyClick, infoClick }) => (
  <div>
    <div>
      <components.Button onClick={errorClick}>Error</components.Button>
      <components.Button onClick={infoClick}>Info</components.Button>
      <components.Button onClick={busyClick}>Busy</components.Button>
      <components.Button onClick={customDialogs}>Custom</components.Button>
    </div>
    <div>
      <components.Button>Message Info</components.Button>
      <components.Button>Message Warning</components.Button>
      <components.Button>Message Error</components.Button>
    </div>
  </div>
);

Dialogs.propTypes = {
  errorClick: PropTypes.func.isRequired,
  busyClick: PropTypes.func.isRequired,
  infoClick: PropTypes.func.isRequired
};

Dialogs.meta = {
  icon: null,
  title: 'Dialogs'
};

const mapStateToProps = (/*state*/) => ({

});

const mapDispatchToProps = (dispatch) => ({
  errorClick : () => dispatch(busySet(new Error('Boom!'))),
  busyClick : async () => {
    dispatch(busySet(true));
    await delay(1000);
    dispatch(busySet(false));
  },
  infoClick : () => dispatch(infoShow('information text'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);

async function delay(value) {
  return new Promise(resolve =>setTimeout(() => resolve(), value));
}
