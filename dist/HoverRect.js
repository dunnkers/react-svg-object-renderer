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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ib3ZlclJlY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJyZW5kZXIiLCJvZmZzZXQiLCJtYXJnaW4iLCJyZWN0IiwieCIsInByb3BzIiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwic3Ryb2tlIiwiZmlsbCIsInN0cm9rZVdpZHRoIiwic3Ryb2tlRGFzaGFycmF5Iiwic3RvcEhvdmVyIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFNBQU4sU0FBd0JGLFNBQXhCLENBQWtDO0FBUy9DRyxXQUFTO0FBQ1AsVUFBTUMsU0FBUyxDQUFmO0FBQ0EsVUFBTUMsU0FBU0QsU0FBUyxDQUF4QjtBQUNBLFVBQU1FLE9BQU87QUFDWEMsU0FBRyxLQUFLQyxLQUFMLENBQVdELENBQVgsR0FBZUgsTUFEUDtBQUVYSyxTQUFHLEtBQUtELEtBQUwsQ0FBV0MsQ0FBWCxHQUFlTCxNQUZQO0FBR1hNLGFBQU8sS0FBS0YsS0FBTCxDQUFXRSxLQUFYLEdBQW1CTCxNQUhmO0FBSVhNLGNBQVEsS0FBS0gsS0FBTCxDQUFXRyxNQUFYLEdBQW9CTjtBQUpqQixLQUFiO0FBT0EsV0FDRSwrQkFDRSx5Q0FDTUMsSUFETjtBQUVFLGFBQU87QUFDTE0sZ0JBQVEsT0FESDtBQUVMQyxjQUFNLE1BRkQ7QUFHTEMscUJBQWE7QUFIUjtBQUZULE9BREYsRUFTRSx5Q0FDTVIsSUFETjtBQUVFLGFBQU87QUFDTE0sZ0JBQVEsbUJBREg7QUFFTEMsY0FBTSxNQUZEO0FBR0xDLHFCQUFhLEtBSFI7QUFJTEMseUJBQWlCO0FBSlosT0FGVDtBQVFFLG9CQUFjLEtBQUtQLEtBQUwsQ0FBV1E7QUFSM0IsT0FURixDQURGO0FBc0JEOztBQXpDOEM7O2dCQUE1QmQsUyxlQUNBO0FBQ2pCSyxLQUFHTixVQUFVZ0IsTUFBVixDQUFpQkMsVUFESDtBQUVqQlQsS0FBR1IsVUFBVWdCLE1BQVYsQ0FBaUJDLFVBRkg7QUFHakJSLFNBQU9ULFVBQVVnQixNQUFWLENBQWlCQyxVQUhQO0FBSWpCUCxVQUFRVixVQUFVZ0IsTUFBVixDQUFpQkMsVUFKUjtBQUtqQkYsYUFBV2YsVUFBVWtCLElBQVYsQ0FBZUQ7QUFMVCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvdmVyUmVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHN0b3BIb3ZlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG9mZnNldCA9IDA7XG4gICAgY29uc3QgbWFyZ2luID0gb2Zmc2V0ICogMjtcbiAgICBjb25zdCByZWN0ID0ge1xuICAgICAgeDogdGhpcy5wcm9wcy54IC0gb2Zmc2V0LFxuICAgICAgeTogdGhpcy5wcm9wcy55IC0gb2Zmc2V0LFxuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGggKyBtYXJnaW4sXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0ICsgbWFyZ2luXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Zz5cbiAgICAgICAgPHJlY3RcbiAgICAgICAgICB7Li4ucmVjdH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgc3Ryb2tlOiAnd2hpdGUnLFxuICAgICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6ICczcHgnXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPHJlY3RcbiAgICAgICAgICB7Li4ucmVjdH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgc3Ryb2tlOiAncmdiKDc3LCAxMTcsIDE4MyknLFxuICAgICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6ICczcHgnLFxuICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5OiAnNSw1J1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLnByb3BzLnN0b3BIb3Zlcn1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9XG59XG4iXX0=