function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class HoverRect extends Component {
  render() {
    const offset = 0;
    const margin = offset * 2;
    const rect = {
      x: this.props.x - offset,
      y: this.props.y - offset,
      width: this.props.width + margin,
      height: this.props.height + margin
    };
    return React.createElement("g", null, React.createElement("rect", _extends({}, rect, {
      style: {
        stroke: 'white',
        fill: 'none',
        strokeWidth: '3px'
      }
    })), React.createElement("rect", _extends({}, rect, {
      style: {
        stroke: 'rgb(77, 117, 183)',
        fill: 'none',
        strokeWidth: '3px',
        strokeDasharray: '5,5'
      },
      onMouseLeave: this.props.stopHover
    })));
  }

}

_defineProperty(HoverRect, "propTypes", {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stopHover: PropTypes.func.isRequired
});
//# sourceMappingURL=HoverRect.js.map