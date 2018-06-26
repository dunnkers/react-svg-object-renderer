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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvSG92ZXJSZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiSG92ZXJSZWN0IiwicmVuZGVyIiwib2Zmc2V0IiwibWFyZ2luIiwicmVjdCIsIngiLCJwcm9wcyIsInkiLCJ3aWR0aCIsImhlaWdodCIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsInN0cm9rZURhc2hhcnJheSIsInN0b3BIb3ZlciIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxTQUFOLFNBQXdCRixTQUF4QixDQUFrQztBQVMvQ0csV0FBUztBQUNQLFVBQU1DLFNBQVMsQ0FBZjtBQUNBLFVBQU1DLFNBQVNELFNBQVMsQ0FBeEI7QUFDQSxVQUFNRSxPQUFPO0FBQ1hDLFNBQUcsS0FBS0MsS0FBTCxDQUFXRCxDQUFYLEdBQWVILE1BRFA7QUFFWEssU0FBRyxLQUFLRCxLQUFMLENBQVdDLENBQVgsR0FBZUwsTUFGUDtBQUdYTSxhQUFPLEtBQUtGLEtBQUwsQ0FBV0UsS0FBWCxHQUFtQkwsTUFIZjtBQUlYTSxjQUFRLEtBQUtILEtBQUwsQ0FBV0csTUFBWCxHQUFvQk47QUFKakIsS0FBYjtBQU9BLFdBQ0UsK0JBQ0UseUNBQ01DLElBRE47QUFFRSxhQUFPO0FBQ0xNLGdCQUFRLE9BREg7QUFFTEMsY0FBTSxNQUZEO0FBR0xDLHFCQUFhO0FBSFI7QUFGVCxPQURGLEVBU0UseUNBQ01SLElBRE47QUFFRSxhQUFPO0FBQ0xNLGdCQUFRLG1CQURIO0FBRUxDLGNBQU0sTUFGRDtBQUdMQyxxQkFBYSxLQUhSO0FBSUxDLHlCQUFpQjtBQUpaLE9BRlQ7QUFRRSxvQkFBYyxLQUFLUCxLQUFMLENBQVdRO0FBUjNCLE9BVEYsQ0FERjtBQXNCRDs7QUF6QzhDOztnQkFBNUJkLFMsZUFDQTtBQUNqQkssS0FBR04sVUFBVWdCLE1BQVYsQ0FBaUJDLFVBREg7QUFFakJULEtBQUdSLFVBQVVnQixNQUFWLENBQWlCQyxVQUZIO0FBR2pCUixTQUFPVCxVQUFVZ0IsTUFBVixDQUFpQkMsVUFIUDtBQUlqQlAsVUFBUVYsVUFBVWdCLE1BQVYsQ0FBaUJDLFVBSlI7QUFLakJGLGFBQVdmLFVBQVVrQixJQUFWLENBQWVEO0FBTFQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3ZlclJlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzdG9wSG92ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBvZmZzZXQgPSAwO1xuICAgIGNvbnN0IG1hcmdpbiA9IG9mZnNldCAqIDI7XG4gICAgY29uc3QgcmVjdCA9IHtcbiAgICAgIHg6IHRoaXMucHJvcHMueCAtIG9mZnNldCxcbiAgICAgIHk6IHRoaXMucHJvcHMueSAtIG9mZnNldCxcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoICsgbWFyZ2luLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCArIG1hcmdpblxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGc+XG4gICAgICAgIDxyZWN0XG4gICAgICAgICAgey4uLnJlY3R9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHN0cm9rZTogJ3doaXRlJyxcbiAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAnM3B4J1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxyZWN0XG4gICAgICAgICAgey4uLnJlY3R9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHN0cm9rZTogJ3JnYig3NywgMTE3LCAxODMpJyxcbiAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAnM3B4JyxcbiAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheTogJzUsNSdcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5wcm9wcy5zdG9wSG92ZXJ9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfVxufVxuIl19