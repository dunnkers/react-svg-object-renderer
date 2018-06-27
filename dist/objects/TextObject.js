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
      nodeRef
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["style", "text", "nodeRef"]);

    delete style.stroke; // ignore stroke, only use fill.

    return React.createElement("text", _extends({
      style: style,
      ref: nodeRef
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
  nodeRef: PropTypes.any
});

_defineProperty(TextObject, "defaultProps", {
  x: 0,
  y: 0,
  style: {},
  text: '',
  nodeRef: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1RleHRPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwicmVuZGVyIiwicHJvcHMiLCJzdHlsZSIsInRleHQiLCJub2RlUmVmIiwib3RoZXJQcm9wcyIsInN0cm9rZSIsIngiLCJudW1iZXIiLCJ5Iiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwiYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJGLFNBQXpCLENBQW1DO0FBb0JoREcsV0FBUztBQUNQLHdCQUtJLEtBQUtDLEtBTFQ7QUFBQSxVQUFNO0FBQ0pDLFdBREk7QUFFSkMsVUFGSTtBQUdKQztBQUhJLEtBQU47QUFBQSxVQUlLQyxVQUpMOztBQU1BLFdBQU9ILE1BQU1JLE1BQWIsQ0FQTyxDQU9jOztBQUVyQixXQUNFO0FBQU0sYUFBT0osS0FBYjtBQUFvQixXQUFLRTtBQUF6QixPQUFzQ0MsVUFBdEMsR0FDR0YsSUFESCxDQURGO0FBS0Q7O0FBbEMrQzs7Z0JBQTdCSixVLGVBQ0E7QUFDakJRLEtBQUdULFVBQVVVLE1BREk7QUFFakJDLEtBQUdYLFVBQVVVLE1BRkk7QUFHakJOLFNBQU9KLFVBQVVZLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1iLFVBQVVjLE1BREs7QUFFckJOLFlBQVFSLFVBQVVjO0FBRkcsR0FBaEIsQ0FIVTtBQU9qQlQsUUFBTUwsVUFBVWMsTUFQQztBQVFqQlIsV0FBU04sVUFBVWU7QUFSRixDOztnQkFEQWQsVSxrQkFZRztBQUNwQlEsS0FBRyxDQURpQjtBQUVwQkUsS0FBRyxDQUZpQjtBQUdwQlAsU0FBTyxFQUhhO0FBSXBCQyxRQUFNLEVBSmM7QUFLcEJDLFdBQVM7QUFMVyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzdHlsZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGZpbGw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBzdHJva2U6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9KSxcbiAgICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnlcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHN0eWxlOiB7fSxcbiAgICB0ZXh0OiAnJyxcbiAgICBub2RlUmVmOiBudWxsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUsXG4gICAgICB0ZXh0LFxuICAgICAgbm9kZVJlZixcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBkZWxldGUgc3R5bGUuc3Ryb2tlOyAvLyBpZ25vcmUgc3Ryb2tlLCBvbmx5IHVzZSBmaWxsLlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDx0ZXh0IHN0eWxlPXtzdHlsZX0gcmVmPXtub2RlUmVmfSB7Li4ub3RoZXJQcm9wc30+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgPC90ZXh0PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==