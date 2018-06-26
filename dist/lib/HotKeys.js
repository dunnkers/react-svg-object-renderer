function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class HoverRect extends Component {
  render() {
    const rect = {
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height
    };
    return React.createElement("rect", _extends({}, rect, {
      fill: "none",
      style: {
        stroke: '#4285f4',
        fill: 'none',
        strokeWidth: '2px'
      }
    }));
  }

}

_defineProperty(HoverRect, "propTypes", {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvSG90S2V5cy5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkhvdmVyUmVjdCIsInJlbmRlciIsInJlY3QiLCJ4IiwicHJvcHMiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJudW1iZXIiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxTQUFOLFNBQXdCRixTQUF4QixDQUFrQztBQVEvQ0csV0FBUztBQUNQLFVBQU1DLE9BQU87QUFDWEMsU0FBRyxLQUFLQyxLQUFMLENBQVdELENBREg7QUFFWEUsU0FBRyxLQUFLRCxLQUFMLENBQVdDLENBRkg7QUFHWEMsYUFBTyxLQUFLRixLQUFMLENBQVdFLEtBSFA7QUFJWEMsY0FBUSxLQUFLSCxLQUFMLENBQVdHO0FBSlIsS0FBYjtBQU9BLFdBQ0UseUNBQ01MLElBRE47QUFFRSxZQUFLLE1BRlA7QUFHRSxhQUFPO0FBQ0xNLGdCQUFRLFNBREg7QUFFTEMsY0FBTSxNQUZEO0FBR0xDLHFCQUFhO0FBSFI7QUFIVCxPQURGO0FBV0Q7O0FBM0I4Qzs7Z0JBQTVCVixTLGVBQ0E7QUFDakJHLEtBQUdKLFVBQVVZLE1BQVYsQ0FBaUJDLFVBREg7QUFFakJQLEtBQUdOLFVBQVVZLE1BQVYsQ0FBaUJDLFVBRkg7QUFHakJOLFNBQU9QLFVBQVVZLE1BQVYsQ0FBaUJDLFVBSFA7QUFJakJMLFVBQVFSLFVBQVVZLE1BQVYsQ0FBaUJDO0FBSlIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3ZlclJlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlY3QgPSB7XG4gICAgICB4OiB0aGlzLnByb3BzLngsXG4gICAgICB5OiB0aGlzLnByb3BzLnksXG4gICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHRcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIHsuLi5yZWN0fVxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgc3Ryb2tlOiAnIzQyODVmNCcsXG4gICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgIHN0cm9rZVdpZHRoOiAnMnB4J1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=