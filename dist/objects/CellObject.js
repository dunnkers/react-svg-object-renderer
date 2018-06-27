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
      value
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["x", "y", "width", "height", "style", "nodeRef", "value"]);

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
      dominantBaseline: "middle"
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
  nodeRef: PropTypes.any.isRequired
});

_defineProperty(CellObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  style: {
    fill: 'white',
    stroke: 'black'
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJyZW5kZXIiLCJwcm9wcyIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHlsZSIsIm5vZGVSZWYiLCJ2YWx1ZSIsIm90aGVyUHJvcHMiLCJudW1iZXIiLCJzaGFwZSIsImZpbGwiLCJzdHJpbmciLCJzdHJva2UiLCJhbnkiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkosU0FBekIsQ0FBbUM7QUF3QmhESyxXQUFTO0FBQ1Asd0JBU0ksS0FBS0MsS0FUVDtBQUFBLFVBQU07QUFDSkMsT0FESTtBQUVKQyxPQUZJO0FBR0pDLFdBSEk7QUFJSkMsWUFKSTtBQUtKQyxXQUxJO0FBTUpDLGFBTkk7QUFPSkM7QUFQSSxLQUFOO0FBQUEsVUFRS0MsVUFSTDs7QUFXQSxXQUNFLCtCQUNFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHUCxDQURMO0FBRUUsU0FBR0MsQ0FGTDtBQUdFLGFBQU9DLEtBSFQ7QUFJRSxjQUFRQyxNQUpWO0FBS0UsYUFBT0MsS0FMVDtBQU1FLGVBQVNDO0FBTlgsT0FPTUUsVUFQTixFQURGLEVBVUUsb0JBQUMsVUFBRDtBQUNFLFNBQUdQLElBQUlFLFFBQVEsQ0FEakI7QUFFRSxTQUFHRCxJQUFJRSxTQUFTLENBRmxCO0FBR0UsWUFBTUcsS0FIUjtBQUlFLHFCQUFjLE1BSmhCO0FBS0Usa0JBQVcsUUFMYjtBQU1FLHdCQUFpQjtBQU5uQixNQVZGLENBREY7QUFxQkQ7O0FBekQrQzs7Z0JBQTdCVCxVLGVBQ0E7QUFDakJHLEtBQUdOLFVBQVVjLE1BREk7QUFFakJQLEtBQUdQLFVBQVVjLE1BRkk7QUFHakJOLFNBQU9SLFVBQVVjLE1BSEE7QUFJakJMLFVBQVFULFVBQVVjLE1BSkQ7QUFLakJKLFNBQU9WLFVBQVVlLEtBQVYsQ0FBZ0I7QUFDckJDLFVBQU1oQixVQUFVaUIsTUFESztBQUVyQkMsWUFBUWxCLFVBQVVpQjtBQUZHLEdBQWhCLENBTFU7QUFTakJOLFdBQVNYLFVBQVVtQixHQUFWLENBQWNDO0FBVE4sQzs7Z0JBREFqQixVLGtCQWFHO0FBQ3BCRyxLQUFHLENBRGlCO0FBRXBCQyxLQUFHLENBRmlCO0FBR3BCQyxTQUFPLEdBSGE7QUFJcEJDLFVBQVEsR0FKWTtBQUtwQkMsU0FBTztBQUNMTSxVQUFNLE9BREQ7QUFFTEUsWUFBUTtBQUZIO0FBTGEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRleHRPYmplY3QgZnJvbSAnLi9UZXh0T2JqZWN0JztcbmltcG9ydCBSZWN0T2JqZWN0IGZyb20gJy4vUmVjdE9iamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGxPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgbm9kZVJlZjogUHJvcFR5cGVzLmFueS5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogMTAwLFxuICAgIHN0eWxlOiB7XG4gICAgICBmaWxsOiAnd2hpdGUnLFxuICAgICAgc3Ryb2tlOiAnYmxhY2snXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBzdHlsZSxcbiAgICAgIG5vZGVSZWYsXG4gICAgICB2YWx1ZSxcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8Zz5cbiAgICAgICAgPFJlY3RPYmplY3RcbiAgICAgICAgICB4PXt4fVxuICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICBub2RlUmVmPXtub2RlUmVmfVxuICAgICAgICAgIHsuLi5vdGhlclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICA8VGV4dE9iamVjdFxuICAgICAgICAgIHg9e3ggKyB3aWR0aCAvIDJ9XG4gICAgICAgICAgeT17eSArIGhlaWdodCAvIDJ9XG4gICAgICAgICAgdGV4dD17dmFsdWV9XG4gICAgICAgICAgcG9pbnRlckV2ZW50cz1cIm5vbmVcIlxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==