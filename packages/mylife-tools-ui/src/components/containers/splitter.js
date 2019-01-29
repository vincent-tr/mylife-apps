import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './splitter.scss';

// from https://github.com/zesik/react-splitter-layout/

const DEFAULT_SPLITTER_SIZE = 4;

const Pane = ({ size = 0, percentage, primary, vertical, children }) => {
  const value = `${size}${percentage ? '%' : 'px'}`;
  const style = {};
  if (!primary) {
    if (vertical) {
      style.height = value;
    } else {
      style.width = value;
    }
  }
  return (
    <div className={classNames('layout-pane', { 'layout-pane-primary': primary })} style={style}>
      {children}
    </div>
  );
};

Pane.propTypes = {
  vertical: PropTypes.bool,
  primary: PropTypes.bool,
  size: PropTypes.number,
  percentage: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

Pane.defaultProps = {
  vertical: false,
  primary: false,
  size: 0,
  percentage: false,
  children: []
};

class Splitter extends React.Component {

  static propTypes = {
    customClassName: PropTypes.string,
    vertical: PropTypes.bool,
    percentage: PropTypes.bool,
    primaryIndex: PropTypes.oneOf([0, 1]),
    primaryMinSize: PropTypes.number,
    secondaryInitialSize: PropTypes.number,
    secondaryMinSize: PropTypes.number,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onSecondaryPaneSizeChange: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.node)
  };

  static defaultProps = {
    customClassName: '',
    vertical: false,
    percentage: false,
    primaryIndex: 0,
    primaryMinSize: 0,
    secondaryInitialSize: undefined,
    secondaryMinSize: 0,
    onDragStart: null,
    onDragEnd: null,
    onSecondaryPaneSizeChange: null,
    children: []
  };

  constructor(props) {
    super(props);

    this.state = {
      secondaryPaneSize: 0,
      resizing: false
    };
  }

  componentDidMount() {
    this.bindEvents();

    let secondaryPaneSize;
    if (typeof this.props.secondaryInitialSize !== 'undefined') {
      secondaryPaneSize = this.props.secondaryInitialSize;
    } else {
      const containerRect = this.container.getBoundingClientRect();
      let splitterRect;
      if (this.splitter) {
        splitterRect = this.splitter.getBoundingClientRect();
      } else {
        // Simulate a splitter
        splitterRect = { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE };
      }
      secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
        left: containerRect.left + ((containerRect.width - splitterRect.width) / 2),
        top: containerRect.top + ((containerRect.height - splitterRect.height) / 2)
      }, false);
    }
    this.setState({ secondaryPaneSize });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.secondaryPaneSize !== this.state.secondaryPaneSize && this.props.onSecondaryPaneSizeChange) {
      this.props.onSecondaryPaneSizeChange(this.state.secondaryPaneSize);
    }
    if (prevState.resizing !== this.state.resizing) {
      if (this.state.resizing) {
        if (this.props.onDragStart) {
          this.props.onDragStart();
        }
      } else if (this.props.onDragEnd) {
        this.props.onDragEnd();
      }
    }
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  getSecondaryPaneSize(containerRect, splitterRect, clientPosition, offsetMouse) {
    let totalSize;
    let splitterSize;
    let offset;
    if (this.props.vertical) {
      totalSize = containerRect.height;
      splitterSize = splitterRect.height;
      offset = clientPosition.top - containerRect.top;
    } else {
      totalSize = containerRect.width;
      splitterSize = splitterRect.width;
      offset = clientPosition.left - containerRect.left;
    }
    if (offsetMouse) {
      offset -= splitterSize / 2;
    }
    if (offset < 0) {
      offset = 0;
    } else if (offset > totalSize - splitterSize) {
      offset = totalSize - splitterSize;
    }

    let secondaryPaneSize;
    if (this.props.primaryIndex === 1) {
      secondaryPaneSize = offset;
    } else {
      secondaryPaneSize = totalSize - splitterSize - offset;
    }
    let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize;
    if (this.props.percentage) {
      secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
      primaryPaneSize = (primaryPaneSize * 100) / totalSize;
      splitterSize = (splitterSize * 100) / totalSize;
      totalSize = 100;
    }

    if (primaryPaneSize < this.props.primaryMinSize) {
      secondaryPaneSize = Math.max(secondaryPaneSize - (this.props.primaryMinSize - primaryPaneSize), 0);
    } else if (secondaryPaneSize < this.props.secondaryMinSize) {
      secondaryPaneSize = Math.min(totalSize - splitterSize - this.props.primaryMinSize, this.props.secondaryMinSize);
    }

    return secondaryPaneSize;
  }

  bindEvents() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  unbindEvents() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleResize = () => {
    if (this.splitter && !this.props.percentage) {
      const containerRect = this.container.getBoundingClientRect();
      const splitterRect = this.splitter.getBoundingClientRect();
      const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
        left: splitterRect.left,
        top: splitterRect.top
      }, false);
      this.setState({ secondaryPaneSize });
    }
  }

  handleMouseMove = (e) => {
    if (this.state.resizing) {
      const containerRect = this.container.getBoundingClientRect();
      const splitterRect = this.splitter.getBoundingClientRect();
      const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
        left: e.clientX,
        top: e.clientY
      }, true);
      clearSelection();
      this.setState({ secondaryPaneSize });
    }
  }

  handleSplitterMouseDown = () => {
    clearSelection();
    this.setState({ resizing: true });
  }

  handleMouseUp = () => {
    this.setState({ resizing: false });
  }

  render() {
    const { customClassName, vertical, percentage, children, primaryIndex } = this.props;
    const { resizing, secondaryPaneSize } = this.state;

    const childrenArray = React.Children.toArray(children);
    if(childrenArray.length !== 2) {
      throw new Error('Expected exactly 2 children');
    }

    const wrappedChildren = children.map((child, index) => {
      const primary = index === primaryIndex;
      return (
        <Pane key={index} vertical={vertical} percentage={percentage} primary={primary} size={primary ? null : secondaryPaneSize}>
          {child}
        </Pane>
      );
    });

    return (
      <div className={classNames('splitter-layout', customClassName, { 'splitter-layout-vertical': vertical, 'layout-changing': resizing } )} ref={(c) => { this.container = c; }}>
        {wrappedChildren[0]}
        {wrappedChildren.length > 1 &&
          <div
            role="separator"
            className="layout-splitter"
            ref={(c) => { this.splitter = c; }}
            onMouseDown={this.handleSplitterMouseDown}
          />
        }
        {wrappedChildren[1]}
      </div>
    );
  }
}

export default Splitter;

function clearSelection() {
  if (document.body.createTextRange) {
    // https://github.com/zesik/react-splitter-layout/issues/16
    // https://stackoverflow.com/questions/22914075/#37580789
    const range = document.body.createTextRange();
    range.collapse();
    range.select();
  } else if (window.getSelection) {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    document.selection.empty();
  }
}
