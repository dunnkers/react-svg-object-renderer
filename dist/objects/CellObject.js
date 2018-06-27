function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextObject from './TextObject';
import RectObject from './RectObject';
export default class CellObject extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "shouldComponentUpdate", () => {
      console.warn('k');
      return false;
    });
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJjb25zb2xlIiwid2FybiIsInJlbmRlciIsInByb3BzIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwibm9kZVJlZiIsInZhbHVlIiwidGV4dFN0eWxlIiwib3RoZXJQcm9wcyIsIm51bWJlciIsInNoYXBlIiwiZmlsbCIsInN0cmluZyIsInN0cm9rZSIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJKLFNBQXpCLENBQW1DO0FBQUE7QUFBQTs7QUFBQSxtREF5QnhCLE1BQU07QUFDNUJLLGNBQVFDLElBQVIsQ0FBYSxHQUFiO0FBQ0EsYUFBTyxLQUFQO0FBQ0QsS0E1QitDO0FBQUE7O0FBOEJoREMsV0FBUztBQUNQLHdCQVVJLEtBQUtDLEtBVlQ7QUFBQSxVQUFNO0FBQ0pDLE9BREk7QUFFSkMsT0FGSTtBQUdKQyxXQUhJO0FBSUpDLFlBSkk7QUFLSkMsV0FMSTtBQU1KQyxhQU5JO0FBT0pDLFdBUEk7QUFRSkM7QUFSSSxLQUFOO0FBQUEsVUFTS0MsVUFUTDs7QUFZQSxXQUNFLCtCQUNFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHUixDQURMO0FBRUUsU0FBR0MsQ0FGTDtBQUdFLGFBQU9DLEtBSFQ7QUFJRSxjQUFRQyxNQUpWO0FBS0UsYUFBT0MsS0FMVDtBQU1FLGVBQVNDO0FBTlgsT0FPTUcsVUFQTixFQURGLEVBVUUsb0JBQUMsVUFBRDtBQUNFLFNBQUdSLElBQUlFLFFBQVEsQ0FEakI7QUFFRSxTQUFHRCxJQUFJRSxTQUFTLENBRmxCO0FBR0UsWUFBTUcsS0FIUjtBQUlFLHFCQUFjLE1BSmhCO0FBS0Usa0JBQVcsUUFMYjtBQU1FLHdCQUFpQixRQU5uQjtBQU9FLGFBQU9DO0FBUFQsTUFWRixDQURGO0FBc0JEOztBQWpFK0M7O2dCQUE3QlosVSxlQUNBO0FBQ2pCSyxLQUFHUixVQUFVaUIsTUFESTtBQUVqQlIsS0FBR1QsVUFBVWlCLE1BRkk7QUFHakJQLFNBQU9WLFVBQVVpQixNQUhBO0FBSWpCTixVQUFRWCxVQUFVaUIsTUFKRDtBQUtqQkwsU0FBT1osVUFBVWtCLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1uQixVQUFVb0IsTUFESztBQUVyQkMsWUFBUXJCLFVBQVVvQjtBQUZHLEdBQWhCLENBTFU7QUFTakJQLFdBQVNiLFVBQVVzQjtBQVRGLEM7O2dCQURBbkIsVSxrQkFhRztBQUNwQkssS0FBRyxDQURpQjtBQUVwQkMsS0FBRyxDQUZpQjtBQUdwQkMsU0FBTyxFQUhhO0FBSXBCQyxVQUFRLEVBSlk7QUFLcEJDLFNBQU87QUFDTE8sVUFBTSxPQUREO0FBRUxFLFlBQVE7QUFGSCxHQUxhO0FBU3BCUixXQUFTO0FBVFcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRleHRPYmplY3QgZnJvbSAnLi9UZXh0T2JqZWN0JztcbmltcG9ydCBSZWN0T2JqZWN0IGZyb20gJy4vUmVjdE9iamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGxPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgbm9kZVJlZjogUHJvcFR5cGVzLmFueVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgc3R5bGU6IHtcbiAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICBzdHJva2U6ICdibGFjaydcbiAgICB9LFxuICAgIG5vZGVSZWY6IG51bGxcbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSA9ICgpID0+IHtcbiAgICBjb25zb2xlLndhcm4oJ2snKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHN0eWxlLFxuICAgICAgbm9kZVJlZixcbiAgICAgIHZhbHVlLFxuICAgICAgdGV4dFN0eWxlLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnPlxuICAgICAgICA8UmVjdE9iamVjdFxuICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgeT17eX1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIG5vZGVSZWY9e25vZGVSZWZ9XG4gICAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0T2JqZWN0XG4gICAgICAgICAgeD17eCArIHdpZHRoIC8gMn1cbiAgICAgICAgICB5PXt5ICsgaGVpZ2h0IC8gMn1cbiAgICAgICAgICB0ZXh0PXt2YWx1ZX1cbiAgICAgICAgICBwb2ludGVyRXZlbnRzPVwibm9uZVwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgc3R5bGU9e3RleHRTdHlsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9XG59XG4iXX0=