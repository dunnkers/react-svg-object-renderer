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
      nodeRef
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["x", "y", "width", "height", "style", "nodeRef"]);

    return React.createElement("rect", _extends({
      x: x,
      y: y,
      width: width,
      height: height,
      style: style,
      ref: nodeRef
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
  nodeRef: PropTypes.any.isRequired
});

_defineProperty(RectObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  style: {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWN0T2JqZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiUmVjdE9iamVjdCIsInJlbmRlciIsInByb3BzIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwibm9kZVJlZiIsIm90aGVyUHJvcHMiLCJudW1iZXIiLCJzaGFwZSIsImZpbGwiLCJzdHJpbmciLCJzdHJva2UiLCJhbnkiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJGLFNBQXpCLENBQW1DO0FBcUJoREcsV0FBUztBQUNQLHdCQVFJLEtBQUtDLEtBUlQ7QUFBQSxVQUFNO0FBQ0pDLE9BREk7QUFFSkMsT0FGSTtBQUdKQyxXQUhJO0FBSUpDLFlBSkk7QUFLSkMsV0FMSTtBQU1KQztBQU5JLEtBQU47QUFBQSxVQU9LQyxVQVBMOztBQVVBLFdBQ0U7QUFDRSxTQUFHTixDQURMO0FBRUUsU0FBR0MsQ0FGTDtBQUdFLGFBQU9DLEtBSFQ7QUFJRSxjQUFRQyxNQUpWO0FBS0UsYUFBT0MsS0FMVDtBQU1FLFdBQUtDO0FBTlAsT0FPTUMsVUFQTixFQURGO0FBV0Q7O0FBM0MrQzs7Z0JBQTdCVCxVLGVBQ0E7QUFDakJHLEtBQUdKLFVBQVVXLE1BREk7QUFFakJOLEtBQUdMLFVBQVVXLE1BRkk7QUFHakJMLFNBQU9OLFVBQVVXLE1BSEE7QUFJakJKLFVBQVFQLFVBQVVXLE1BSkQ7QUFLakJILFNBQU9SLFVBQVVZLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1iLFVBQVVjLE1BREs7QUFFckJDLFlBQVFmLFVBQVVjO0FBRkcsR0FBaEIsQ0FMVTtBQVNqQkwsV0FBU1QsVUFBVWdCLEdBQVYsQ0FBY0M7QUFUTixDOztnQkFEQWhCLFUsa0JBYUc7QUFDcEJHLEtBQUcsQ0FEaUI7QUFFcEJDLEtBQUcsQ0FGaUI7QUFHcEJDLFNBQU8sRUFIYTtBQUlwQkMsVUFBUSxFQUpZO0FBS3BCQyxTQUFPO0FBTGEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0T2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgc3R5bGU6IHt9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHN0eWxlLFxuICAgICAgbm9kZVJlZixcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB4PXt4fVxuICAgICAgICB5PXt5fVxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIHJlZj17bm9kZVJlZn1cbiAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==