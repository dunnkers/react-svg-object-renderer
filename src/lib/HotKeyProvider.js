import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

export default class HotKeyProvider extends Component {
  static propTypes = {
    width: PropTypes.number,
    setMultiSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    width: ''
  }

  handlers = {
    multiSelectOn: () => this.props.setMultiSelect(true),
    multiSelectOff: () => this.props.setMultiSelect(false)
  };

  map = {
    multiSelectOn: { sequence: 'ctrl', action: 'keydown' },
    multiSelectOff: { sequence: 'ctrl', action: 'keyup' }
  };

  render() {
    const { width } = this.props;
    const hotKeyStyle = {
      width,
      outline: 0
    };

    return (
      <HotKeys
        style={hotKeyStyle}
        keyMap={this.map}
        handlers={this.handlers}
        focused
        attach={window}
        onMouseDown={(evt) => evt.preventDefault()}
      >
        {this.props.children}
      </HotKeys>
    );
  }
}
