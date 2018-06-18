function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class TextObject extends Component {
  render() {
    const _this$props = this.props,
          {
      style,
      text,
      refCallback
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["style", "text", "refCallback"]);

    return React.createElement("text", _extends({
      style: style,
      ref: refCallback
    }, otherProps), text);
  }

}

_defineProperty(TextObject, "propTypes", {
  x: PropTypes.number,
  y: PropTypes.number,
  style: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
  }),
  text: PropTypes.string,
  refCallback: PropTypes.func.isRequired
});

_defineProperty(TextObject, "defaultProps", {
  x: 0,
  y: 0,
  style: {},
  text: ''
});
//# sourceMappingURL=TextObject.js.map