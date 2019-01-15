'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import StoreProvider from '../../../components/application/store-provider';
import { Button } from '../../../components';

import './dialog.scss';

class Dialog extends React.Component {

  constructor(props) {
    super(props);
    this.defaultRef = React.createRef();
  }

  onMount = () => {
    const node = this.defaultRef.current;
    node && node.focus();
  }

  onKey = (key) => {
    const { onClose, actions } = this.props;
    for(const { closeValue, shortcuts = [] } of actions) {
      if(shortcuts.includes(key)) {
        onClose(closeValue);
        return;
      }
    }
  }

  renderActions() {
    const { actions, onClose } = this.props;
    if(!actions) {
      return null;
    }

    const hasDefault = !!actions.find(a => a.isDefault);
    const keys = [];
    for(const { shortcuts = [] } of actions) {
      if(shortcuts.length) {
        keys.push(...shortcuts);
      }
    }

    return (
      <div className='actions'>
        <KeyboardEventHandler handleKeys={keys} onKeyEvent={this.onKey}>
          {actions.map(({ isDefault, shortcuts, closeValue, tabIndex, content, ...props }, index) => {
            void shortcuts;
            const finalIsDefault = isDefault || (!hasDefault && !index);
            return (
              <Button
                key={index}
                tabIndex={tabIndex || (index + 1)}
                onClick={() => onClose(closeValue)}
                ref={finalIsDefault && this.defaultRef}
                {...props}>
                {content}
              </Button>
            );
          })}
        </KeyboardEventHandler>
      </div>
    );
  }

  render() {
    const { open, onClose, title, actions, keyMap, children, ...props } = this.props;
    void onClose;
    void actions;
    void keyMap;

    return (
      // http://reactcommunity.org/react-modal/#usage
      <Modal
        className='dialog'
        overlayClassName='dialog-overlay'
        isOpen={open}
        shouldCloseOnOverlayClick={false}
        KeyboardEventHandler={false}
        onAfterOpen={this.onMount}
        {...props}>
        <StoreProvider>
          <React.Fragment>

            {title && (
              <div className='title'>
                {title}
              </div>
            )}

            <div className='content'>
              {children}
            </div>

            {this.renderActions()}

          </React.Fragment>
        </StoreProvider>
      </Modal>
    );
  }

  static propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.node,
    actions: PropTypes.array,
    children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
  };
}

export default Dialog;
