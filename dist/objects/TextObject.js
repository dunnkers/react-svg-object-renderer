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
  nodeRef: PropTypes.any.isRequired
});

_defineProperty(TextObject, "defaultProps", {
  x: 0,
  y: 0,
  style: {},
  text: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1RleHRPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwicmVuZGVyIiwicHJvcHMiLCJzdHlsZSIsInRleHQiLCJub2RlUmVmIiwib3RoZXJQcm9wcyIsInN0cm9rZSIsIngiLCJudW1iZXIiLCJ5Iiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwiYW55IiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxVQUFOLFNBQXlCRixTQUF6QixDQUFtQztBQW1CaERHLFdBQVM7QUFDUCx3QkFLSSxLQUFLQyxLQUxUO0FBQUEsVUFBTTtBQUNKQyxXQURJO0FBRUpDLFVBRkk7QUFHSkM7QUFISSxLQUFOO0FBQUEsVUFJS0MsVUFKTDs7QUFNQSxXQUFPSCxNQUFNSSxNQUFiLENBUE8sQ0FPYzs7QUFFckIsV0FDRTtBQUFNLGFBQU9KLEtBQWI7QUFBb0IsV0FBS0U7QUFBekIsT0FBc0NDLFVBQXRDLEdBQ0dGLElBREgsQ0FERjtBQUtEOztBQWpDK0M7O2dCQUE3QkosVSxlQUNBO0FBQ2pCUSxLQUFHVCxVQUFVVSxNQURJO0FBRWpCQyxLQUFHWCxVQUFVVSxNQUZJO0FBR2pCTixTQUFPSixVQUFVWSxLQUFWLENBQWdCO0FBQ3JCQyxVQUFNYixVQUFVYyxNQURLO0FBRXJCTixZQUFRUixVQUFVYztBQUZHLEdBQWhCLENBSFU7QUFPakJULFFBQU1MLFVBQVVjLE1BUEM7QUFRakJSLFdBQVNOLFVBQVVlLEdBQVYsQ0FBY0M7QUFSTixDOztnQkFEQWYsVSxrQkFZRztBQUNwQlEsS0FBRyxDQURpQjtBQUVwQkUsS0FBRyxDQUZpQjtBQUdwQlAsU0FBTyxFQUhhO0FBSXBCQyxRQUFNO0FBSmMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0T2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgdGV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBub2RlUmVmOiBQcm9wVHlwZXMuYW55LmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHN0eWxlOiB7fSxcbiAgICB0ZXh0OiAnJ1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlLFxuICAgICAgdGV4dCxcbiAgICAgIG5vZGVSZWYsXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgZGVsZXRlIHN0eWxlLnN0cm9rZTsgLy8gaWdub3JlIHN0cm9rZSwgb25seSB1c2UgZmlsbC5cblxuICAgIHJldHVybiAoXG4gICAgICA8dGV4dCBzdHlsZT17c3R5bGV9IHJlZj17bm9kZVJlZn0gey4uLm90aGVyUHJvcHN9PlxuICAgICAgICB7dGV4dH1cbiAgICAgIDwvdGV4dD5cbiAgICApO1xuICB9XG59XG4iXX0=