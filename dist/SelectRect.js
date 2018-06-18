function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class SelectRect extends Component {
  render() {
    const rect = {
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height
    };
    return React.createElement("rect", _extends({}, rect, {
      style: {
        stroke: '#4285f4',
        fill: 'none',
        strokeWidth: '3px'
      },
      onMouseDown: this.props.select
    }));
  }

}

_defineProperty(SelectRect, "propTypes", {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  select: PropTypes.func.isRequired
});
//# sourceMappingURL=SelectRect.js.map