function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class SurfaceRect extends Component {
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

_defineProperty(SurfaceRect, "propTypes", {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  select: PropTypes.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU3VyZmFjZVJlY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJTdXJmYWNlUmVjdCIsInJlbmRlciIsInJlY3QiLCJ4IiwicHJvcHMiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzZWxlY3QiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsV0FBTixTQUEwQkYsU0FBMUIsQ0FBb0M7QUFTakRHLFdBQVM7QUFDUCxVQUFNQyxPQUFPO0FBQ1hDLFNBQUcsS0FBS0MsS0FBTCxDQUFXRCxDQURIO0FBRVhFLFNBQUcsS0FBS0QsS0FBTCxDQUFXQyxDQUZIO0FBR1hDLGFBQU8sS0FBS0YsS0FBTCxDQUFXRSxLQUhQO0FBSVhDLGNBQVEsS0FBS0gsS0FBTCxDQUFXRztBQUpSLEtBQWI7QUFPQSxXQUNFLHlDQUNNTCxJQUROO0FBRUUsYUFBTztBQUNMTSxnQkFBUSxTQURIO0FBRUxDLGNBQU0sTUFGRDtBQUdMQyxxQkFBYTtBQUhSLE9BRlQ7QUFPRSxtQkFBYSxLQUFLTixLQUFMLENBQVdPO0FBUDFCLE9BREY7QUFXRDs7QUE1QmdEOztnQkFBOUJYLFcsZUFDQTtBQUNqQkcsS0FBR0osVUFBVWEsTUFBVixDQUFpQkMsVUFESDtBQUVqQlIsS0FBR04sVUFBVWEsTUFBVixDQUFpQkMsVUFGSDtBQUdqQlAsU0FBT1AsVUFBVWEsTUFBVixDQUFpQkMsVUFIUDtBQUlqQk4sVUFBUVIsVUFBVWEsTUFBVixDQUFpQkMsVUFKUjtBQUtqQkYsVUFBUVosVUFBVWUsSUFBVixDQUFlRDtBQUxOLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VyZmFjZVJlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZWN0ID0ge1xuICAgICAgeDogdGhpcy5wcm9wcy54LFxuICAgICAgeTogdGhpcy5wcm9wcy55LFxuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB7Li4ucmVjdH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBzdHJva2U6ICcjNDI4NWY0JyxcbiAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6ICczcHgnXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLnNlbGVjdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19