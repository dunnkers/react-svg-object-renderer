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
  style: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
  }),
  text: PropTypes.string,
  refCallback: PropTypes.func.isRequired
});

_defineProperty(TextObject, "defaultProps", {
  style: {},
  text: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXh0T2JqZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiVGV4dE9iamVjdCIsInJlbmRlciIsInByb3BzIiwic3R5bGUiLCJ0ZXh0IiwicmVmQ2FsbGJhY2siLCJvdGhlclByb3BzIiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwic3Ryb2tlIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkYsU0FBekIsQ0FBbUM7QUFlaERHLFdBQVM7QUFDUCx3QkFLSSxLQUFLQyxLQUxUO0FBQUEsVUFBTTtBQUNKQyxXQURJO0FBRUpDLFVBRkk7QUFHSkM7QUFISSxLQUFOO0FBQUEsVUFJS0MsVUFKTDs7QUFPQSxXQUNFO0FBQU0sYUFBT0gsS0FBYjtBQUFvQixXQUFLRTtBQUF6QixPQUEwQ0MsVUFBMUMsR0FDR0YsSUFESCxDQURGO0FBS0Q7O0FBNUIrQzs7Z0JBQTdCSixVLGVBQ0E7QUFDakJHLFNBQU9KLFVBQVVRLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1ULFVBQVVVLE1BREs7QUFFckJDLFlBQVFYLFVBQVVVO0FBRkcsR0FBaEIsQ0FEVTtBQUtqQkwsUUFBTUwsVUFBVVUsTUFMQztBQU1qQkosZUFBYU4sVUFBVVksSUFBVixDQUFlQztBQU5YLEM7O2dCQURBWixVLGtCQVVHO0FBQ3BCRyxTQUFPLEVBRGE7QUFFcEJDLFFBQU07QUFGYyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIHRleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVmQ2FsbGJhY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc3R5bGU6IHt9LFxuICAgIHRleHQ6ICcnXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUsXG4gICAgICB0ZXh0LFxuICAgICAgcmVmQ2FsbGJhY2ssXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHRleHQgc3R5bGU9e3N0eWxlfSByZWY9e3JlZkNhbGxiYWNrfSB7Li4ub3RoZXJQcm9wc30+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgPC90ZXh0PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==