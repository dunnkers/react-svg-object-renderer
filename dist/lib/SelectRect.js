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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2VsZWN0UmVjdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIlNlbGVjdFJlY3QiLCJyZW5kZXIiLCJyZWN0IiwieCIsInByb3BzIiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwic3Ryb2tlIiwiZmlsbCIsInN0cm9rZVdpZHRoIiwic2VsZWN0IiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJGLFNBQXpCLENBQW1DO0FBU2hERyxXQUFTO0FBQ1AsVUFBTUMsT0FBTztBQUNYQyxTQUFHLEtBQUtDLEtBQUwsQ0FBV0QsQ0FESDtBQUVYRSxTQUFHLEtBQUtELEtBQUwsQ0FBV0MsQ0FGSDtBQUdYQyxhQUFPLEtBQUtGLEtBQUwsQ0FBV0UsS0FIUDtBQUlYQyxjQUFRLEtBQUtILEtBQUwsQ0FBV0c7QUFKUixLQUFiO0FBT0EsV0FDRSx5Q0FDTUwsSUFETjtBQUVFLGFBQU87QUFDTE0sZ0JBQVEsU0FESDtBQUVMQyxjQUFNLE1BRkQ7QUFHTEMscUJBQWE7QUFIUixPQUZUO0FBT0UsbUJBQWEsS0FBS04sS0FBTCxDQUFXTztBQVAxQixPQURGO0FBV0Q7O0FBNUIrQzs7Z0JBQTdCWCxVLGVBQ0E7QUFDakJHLEtBQUdKLFVBQVVhLE1BQVYsQ0FBaUJDLFVBREg7QUFFakJSLEtBQUdOLFVBQVVhLE1BQVYsQ0FBaUJDLFVBRkg7QUFHakJQLFNBQU9QLFVBQVVhLE1BQVYsQ0FBaUJDLFVBSFA7QUFJakJOLFVBQVFSLFVBQVVhLE1BQVYsQ0FBaUJDLFVBSlI7QUFLakJGLFVBQVFaLFVBQVVlLElBQVYsQ0FBZUQ7QUFMTixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFJlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBzZWxlY3Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHJlY3QgPSB7XHJcbiAgICAgIHg6IHRoaXMucHJvcHMueCxcclxuICAgICAgeTogdGhpcy5wcm9wcy55LFxyXG4gICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8cmVjdFxyXG4gICAgICAgIHsuLi5yZWN0fVxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBzdHJva2U6ICcjNDI4NWY0JyxcclxuICAgICAgICAgIGZpbGw6ICdub25lJyxcclxuICAgICAgICAgIHN0cm9rZVdpZHRoOiAnM3B4J1xyXG4gICAgICAgIH19XHJcbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMuc2VsZWN0fVxyXG4gICAgICAvPlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19