function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class RectObject extends Component {
  render() {
    const _this$props = this.props,
          {
      x,
      y,
      width,
      height,
      style,
      refCallback
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["x", "y", "width", "height", "style", "refCallback"]);

    return React.createElement("rect", _extends({
      x: x,
      y: y,
      width: width,
      height: height,
      style: style,
      ref: refCallback
    }, otherProps));
  }

}

_defineProperty(RectObject, "propTypes", {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
  }),
  refCallback: PropTypes.func.isRequired
});

_defineProperty(RectObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  style: {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWN0T2JqZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiUmVjdE9iamVjdCIsInJlbmRlciIsInByb3BzIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwicmVmQ2FsbGJhY2siLCJvdGhlclByb3BzIiwibnVtYmVyIiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwic3Ryb2tlIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkYsU0FBekIsQ0FBbUM7QUFxQmhERyxXQUFTO0FBQ1Asd0JBUUksS0FBS0MsS0FSVDtBQUFBLFVBQU07QUFDSkMsT0FESTtBQUVKQyxPQUZJO0FBR0pDLFdBSEk7QUFJSkMsWUFKSTtBQUtKQyxXQUxJO0FBTUpDO0FBTkksS0FBTjtBQUFBLFVBT0tDLFVBUEw7O0FBVUEsV0FDRTtBQUNFLFNBQUdOLENBREw7QUFFRSxTQUFHQyxDQUZMO0FBR0UsYUFBT0MsS0FIVDtBQUlFLGNBQVFDLE1BSlY7QUFLRSxhQUFPQyxLQUxUO0FBTUUsV0FBS0M7QUFOUCxPQU9NQyxVQVBOLEVBREY7QUFXRDs7QUEzQytDOztnQkFBN0JULFUsZUFDQTtBQUNqQkcsS0FBR0osVUFBVVcsTUFESTtBQUVqQk4sS0FBR0wsVUFBVVcsTUFGSTtBQUdqQkwsU0FBT04sVUFBVVcsTUFIQTtBQUlqQkosVUFBUVAsVUFBVVcsTUFKRDtBQUtqQkgsU0FBT1IsVUFBVVksS0FBVixDQUFnQjtBQUNyQkMsVUFBTWIsVUFBVWMsTUFESztBQUVyQkMsWUFBUWYsVUFBVWM7QUFGRyxHQUFoQixDQUxVO0FBU2pCTCxlQUFhVCxVQUFVZ0IsSUFBVixDQUFlQztBQVRYLEM7O2dCQURBaEIsVSxrQkFhRztBQUNwQkcsS0FBRyxDQURpQjtBQUVwQkMsS0FBRyxDQUZpQjtBQUdwQkMsU0FBTyxFQUhhO0FBSXBCQyxVQUFRLEVBSlk7QUFLcEJDLFNBQU87QUFMYSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgcmVmQ2FsbGJhY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IDUwLFxuICAgIHN0eWxlOiB7fVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBzdHlsZSxcbiAgICAgIHJlZkNhbGxiYWNrLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIHg9e3h9XG4gICAgICAgIHk9e3l9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgcmVmPXtyZWZDYWxsYmFja31cbiAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==