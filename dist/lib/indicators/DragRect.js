function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class DragRect extends Component {
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

_defineProperty(DragRect, "propTypes", {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaW5kaWNhdG9ycy9EcmFnUmVjdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkRyYWdSZWN0IiwicmVuZGVyIiwicmVjdCIsIngiLCJwcm9wcyIsInkiLCJ3aWR0aCIsImhlaWdodCIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsIm51bWJlciIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFFBQU4sU0FBdUJGLFNBQXZCLENBQWlDO0FBUTlDRyxXQUFTO0FBQ1AsVUFBTUMsT0FBTztBQUNYQyxTQUFHLEtBQUtDLEtBQUwsQ0FBV0QsQ0FESDtBQUVYRSxTQUFHLEtBQUtELEtBQUwsQ0FBV0MsQ0FGSDtBQUdYQyxhQUFPLEtBQUtGLEtBQUwsQ0FBV0UsS0FIUDtBQUlYQyxjQUFRLEtBQUtILEtBQUwsQ0FBV0c7QUFKUixLQUFiO0FBT0EsV0FDRSx5Q0FDTUwsSUFETjtBQUVFLFlBQUssTUFGUDtBQUdFLGFBQU87QUFDTE0sZ0JBQVEsU0FESDtBQUVMQyxjQUFNLE1BRkQ7QUFHTEMscUJBQWE7QUFIUjtBQUhULE9BREY7QUFXRDs7QUEzQjZDOztnQkFBM0JWLFEsZUFDQTtBQUNqQkcsS0FBR0osVUFBVVksTUFBVixDQUFpQkMsVUFESDtBQUVqQlAsS0FBR04sVUFBVVksTUFBVixDQUFpQkMsVUFGSDtBQUdqQk4sU0FBT1AsVUFBVVksTUFBVixDQUFpQkMsVUFIUDtBQUlqQkwsVUFBUVIsVUFBVVksTUFBVixDQUFpQkM7QUFKUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYWdSZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZWN0ID0ge1xuICAgICAgeDogdGhpcy5wcm9wcy54LFxuICAgICAgeTogdGhpcy5wcm9wcy55LFxuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB7Li4ucmVjdH1cbiAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHN0cm9rZTogJyM0Mjg1ZjQnLFxuICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICBzdHJva2VXaWR0aDogJzJweCdcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19