function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextObject from './TextObject';
import RectObject from './RectObject';
export default class CellObject extends Component {
  render() {
    const _this$props = this.props,
          {
      x,
      y,
      width,
      height,
      style,
      nodeRef,
      value,
      textStyle
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["x", "y", "width", "height", "style", "nodeRef", "value", "textStyle"]);

    return React.createElement("g", null, React.createElement(RectObject, _extends({
      x: x,
      y: y,
      width: width,
      height: height,
      style: style,
      nodeRef: nodeRef
    }, otherProps)), React.createElement(TextObject, {
      x: x + width / 2,
      y: y + height / 2,
      text: value,
      pointerEvents: "none",
      textAnchor: "middle",
      dominantBaseline: "middle",
      style: textStyle
    }));
  }

}

_defineProperty(CellObject, "propTypes", {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
  }),
  nodeRef: PropTypes.any
});

_defineProperty(CellObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  style: {
    fill: 'white',
    stroke: 'black'
  },
  nodeRef: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJyZW5kZXIiLCJwcm9wcyIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHlsZSIsIm5vZGVSZWYiLCJ2YWx1ZSIsInRleHRTdHlsZSIsIm90aGVyUHJvcHMiLCJudW1iZXIiLCJzaGFwZSIsImZpbGwiLCJzdHJpbmciLCJzdHJva2UiLCJhbnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBRUEsZUFBZSxNQUFNQyxVQUFOLFNBQXlCSixTQUF6QixDQUFtQztBQXlCaERLLFdBQVM7QUFDUCx3QkFVSSxLQUFLQyxLQVZUO0FBQUEsVUFBTTtBQUNKQyxPQURJO0FBRUpDLE9BRkk7QUFHSkMsV0FISTtBQUlKQyxZQUpJO0FBS0pDLFdBTEk7QUFNSkMsYUFOSTtBQU9KQyxXQVBJO0FBUUpDO0FBUkksS0FBTjtBQUFBLFVBU0tDLFVBVEw7O0FBWUEsV0FDRSwrQkFDRSxvQkFBQyxVQUFEO0FBQ0UsU0FBR1IsQ0FETDtBQUVFLFNBQUdDLENBRkw7QUFHRSxhQUFPQyxLQUhUO0FBSUUsY0FBUUMsTUFKVjtBQUtFLGFBQU9DLEtBTFQ7QUFNRSxlQUFTQztBQU5YLE9BT01HLFVBUE4sRUFERixFQVVFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHUixJQUFJRSxRQUFRLENBRGpCO0FBRUUsU0FBR0QsSUFBSUUsU0FBUyxDQUZsQjtBQUdFLFlBQU1HLEtBSFI7QUFJRSxxQkFBYyxNQUpoQjtBQUtFLGtCQUFXLFFBTGI7QUFNRSx3QkFBaUIsUUFObkI7QUFPRSxhQUFPQztBQVBULE1BVkYsQ0FERjtBQXNCRDs7QUE1RCtDOztnQkFBN0JWLFUsZUFDQTtBQUNqQkcsS0FBR04sVUFBVWUsTUFESTtBQUVqQlIsS0FBR1AsVUFBVWUsTUFGSTtBQUdqQlAsU0FBT1IsVUFBVWUsTUFIQTtBQUlqQk4sVUFBUVQsVUFBVWUsTUFKRDtBQUtqQkwsU0FBT1YsVUFBVWdCLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1qQixVQUFVa0IsTUFESztBQUVyQkMsWUFBUW5CLFVBQVVrQjtBQUZHLEdBQWhCLENBTFU7QUFTakJQLFdBQVNYLFVBQVVvQjtBQVRGLEM7O2dCQURBakIsVSxrQkFhRztBQUNwQkcsS0FBRyxDQURpQjtBQUVwQkMsS0FBRyxDQUZpQjtBQUdwQkMsU0FBTyxFQUhhO0FBSXBCQyxVQUFRLEVBSlk7QUFLcEJDLFNBQU87QUFDTE8sVUFBTSxPQUREO0FBRUxFLFlBQVE7QUFGSCxHQUxhO0FBU3BCUixXQUFTO0FBVFcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRleHRPYmplY3QgZnJvbSAnLi9UZXh0T2JqZWN0JztcbmltcG9ydCBSZWN0T2JqZWN0IGZyb20gJy4vUmVjdE9iamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGxPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgbm9kZVJlZjogUHJvcFR5cGVzLmFueVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgc3R5bGU6IHtcbiAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICBzdHJva2U6ICdibGFjaydcbiAgICB9LFxuICAgIG5vZGVSZWY6IG51bGxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgc3R5bGUsXG4gICAgICBub2RlUmVmLFxuICAgICAgdmFsdWUsXG4gICAgICB0ZXh0U3R5bGUsXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGc+XG4gICAgICAgIDxSZWN0T2JqZWN0XG4gICAgICAgICAgeD17eH1cbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgbm9kZVJlZj17bm9kZVJlZn1cbiAgICAgICAgICB7Li4ub3RoZXJQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgPFRleHRPYmplY3RcbiAgICAgICAgICB4PXt4ICsgd2lkdGggLyAyfVxuICAgICAgICAgIHk9e3kgKyBoZWlnaHQgLyAyfVxuICAgICAgICAgIHRleHQ9e3ZhbHVlfVxuICAgICAgICAgIHBvaW50ZXJFdmVudHM9XCJub25lXCJcbiAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICBkb21pbmFudEJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgICBzdHlsZT17dGV4dFN0eWxlfVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==