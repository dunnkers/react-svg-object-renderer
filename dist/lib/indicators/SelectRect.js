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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaW5kaWNhdG9ycy9TZWxlY3RSZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiU2VsZWN0UmVjdCIsInJlbmRlciIsInJlY3QiLCJ4IiwicHJvcHMiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzZWxlY3QiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkYsU0FBekIsQ0FBbUM7QUFTaERHLFdBQVM7QUFDUCxVQUFNQyxPQUFPO0FBQ1hDLFNBQUcsS0FBS0MsS0FBTCxDQUFXRCxDQURIO0FBRVhFLFNBQUcsS0FBS0QsS0FBTCxDQUFXQyxDQUZIO0FBR1hDLGFBQU8sS0FBS0YsS0FBTCxDQUFXRSxLQUhQO0FBSVhDLGNBQVEsS0FBS0gsS0FBTCxDQUFXRztBQUpSLEtBQWI7QUFPQSxXQUNFLHlDQUNNTCxJQUROO0FBRUUsYUFBTztBQUNMTSxnQkFBUSxTQURIO0FBRUxDLGNBQU0sTUFGRDtBQUdMQyxxQkFBYTtBQUhSLE9BRlQ7QUFPRSxtQkFBYSxLQUFLTixLQUFMLENBQVdPO0FBUDFCLE9BREY7QUFXRDs7QUE1QitDOztnQkFBN0JYLFUsZUFDQTtBQUNqQkcsS0FBR0osVUFBVWEsTUFBVixDQUFpQkMsVUFESDtBQUVqQlIsS0FBR04sVUFBVWEsTUFBVixDQUFpQkMsVUFGSDtBQUdqQlAsU0FBT1AsVUFBVWEsTUFBVixDQUFpQkMsVUFIUDtBQUlqQk4sVUFBUVIsVUFBVWEsTUFBVixDQUFpQkMsVUFKUjtBQUtqQkYsVUFBUVosVUFBVWUsSUFBVixDQUFlRDtBQUxOLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0UmVjdCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHNlbGVjdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgcmVjdCA9IHtcclxuICAgICAgeDogdGhpcy5wcm9wcy54LFxyXG4gICAgICB5OiB0aGlzLnByb3BzLnksXHJcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxyZWN0XHJcbiAgICAgICAgey4uLnJlY3R9XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIHN0cm9rZTogJyM0Mjg1ZjQnLFxyXG4gICAgICAgICAgZmlsbDogJ25vbmUnLFxyXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6ICczcHgnXHJcbiAgICAgICAgfX1cclxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5wcm9wcy5zZWxlY3R9XHJcbiAgICAgIC8+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=