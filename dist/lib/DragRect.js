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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvRHJhZ1JlY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJEcmFnUmVjdCIsInJlbmRlciIsInJlY3QiLCJ4IiwicHJvcHMiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJudW1iZXIiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxRQUFOLFNBQXVCRixTQUF2QixDQUFpQztBQVE5Q0csV0FBUztBQUNQLFVBQU1DLE9BQU87QUFDWEMsU0FBRyxLQUFLQyxLQUFMLENBQVdELENBREg7QUFFWEUsU0FBRyxLQUFLRCxLQUFMLENBQVdDLENBRkg7QUFHWEMsYUFBTyxLQUFLRixLQUFMLENBQVdFLEtBSFA7QUFJWEMsY0FBUSxLQUFLSCxLQUFMLENBQVdHO0FBSlIsS0FBYjtBQU9BLFdBQ0UseUNBQ01MLElBRE47QUFFRSxZQUFLLE1BRlA7QUFHRSxhQUFPO0FBQ0xNLGdCQUFRLFNBREg7QUFFTEMsY0FBTSxNQUZEO0FBR0xDLHFCQUFhO0FBSFI7QUFIVCxPQURGO0FBV0Q7O0FBM0I2Qzs7Z0JBQTNCVixRLGVBQ0E7QUFDakJHLEtBQUdKLFVBQVVZLE1BQVYsQ0FBaUJDLFVBREg7QUFFakJQLEtBQUdOLFVBQVVZLE1BQVYsQ0FBaUJDLFVBRkg7QUFHakJOLFNBQU9QLFVBQVVZLE1BQVYsQ0FBaUJDLFVBSFA7QUFJakJMLFVBQVFSLFVBQVVZLE1BQVYsQ0FBaUJDO0FBSlIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmFnUmVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVjdCA9IHtcbiAgICAgIHg6IHRoaXMucHJvcHMueCxcbiAgICAgIHk6IHRoaXMucHJvcHMueSxcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgey4uLnJlY3R9XG4gICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBzdHJva2U6ICcjNDI4NWY0JyxcbiAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6ICcycHgnXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==