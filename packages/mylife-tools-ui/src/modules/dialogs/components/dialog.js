'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    const { actions, onClose, actionsClassName } = this.props;
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
      <div className={classNames('actions', actionsClassName)}>
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

  renderTitle() {
    let { title, titleClassName } = this.props;
    if(!title) {
      return;
    }

    if(typeof title === 'string') {
      title = (<h3>{title}</h3>);
    }

    return (
      <div className={classNames('title', titleClassName)}>
        {title}
      </div>
    );
  }

  render() {
    const { open, onClose, title, actions, keyMap, children, className, titleClassName, actionsClassName, ...props } = this.props;
    void onClose;
    void actions;
    void keyMap;
    void title;
    void titleClassName;
    void actionsClassName;

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

            {this.renderTitle()}

            <div className={classNames('content', className)}>
              {children}
            </div>

            {this.renderActions()}

          </React.Fragment>
        </StoreProvider>
      </Modal>
    );
  }

  static propTypes = {
    className: PropTypes.string,
    titleClassName: PropTypes.string,
    actionsClassName: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.node,
    actions: PropTypes.array,
    children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
  };
}

export default Dialog;
