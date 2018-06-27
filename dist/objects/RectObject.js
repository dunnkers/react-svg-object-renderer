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
  nodeRef: PropTypes.any
});

_defineProperty(RectObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  style: {},
  nodeRef: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1JlY3RPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJSZWN0T2JqZWN0IiwicmVuZGVyIiwicHJvcHMiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJub2RlUmVmIiwib3RoZXJQcm9wcyIsIm51bWJlciIsInNoYXBlIiwiZmlsbCIsInN0cmluZyIsInN0cm9rZSIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxVQUFOLFNBQXlCRixTQUF6QixDQUFtQztBQXNCaERHLFdBQVM7QUFDUCx3QkFRSSxLQUFLQyxLQVJUO0FBQUEsVUFBTTtBQUNKQyxPQURJO0FBRUpDLE9BRkk7QUFHSkMsV0FISTtBQUlKQyxZQUpJO0FBS0pDLFdBTEk7QUFNSkM7QUFOSSxLQUFOO0FBQUEsVUFPS0MsVUFQTDs7QUFVQSxXQUNFO0FBQ0UsU0FBR04sQ0FETDtBQUVFLFNBQUdDLENBRkw7QUFHRSxhQUFPQyxLQUhUO0FBSUUsY0FBUUMsTUFKVjtBQUtFLGFBQU9DLEtBTFQ7QUFNRSxXQUFLQztBQU5QLE9BT01DLFVBUE4sRUFERjtBQVdEOztBQTVDK0M7O2dCQUE3QlQsVSxlQUNBO0FBQ2pCRyxLQUFHSixVQUFVVyxNQURJO0FBRWpCTixLQUFHTCxVQUFVVyxNQUZJO0FBR2pCTCxTQUFPTixVQUFVVyxNQUhBO0FBSWpCSixVQUFRUCxVQUFVVyxNQUpEO0FBS2pCSCxTQUFPUixVQUFVWSxLQUFWLENBQWdCO0FBQ3JCQyxVQUFNYixVQUFVYyxNQURLO0FBRXJCQyxZQUFRZixVQUFVYztBQUZHLEdBQWhCLENBTFU7QUFTakJMLFdBQVNULFVBQVVnQjtBQVRGLEM7O2dCQURBZixVLGtCQWFHO0FBQ3BCRyxLQUFHLENBRGlCO0FBRXBCQyxLQUFHLENBRmlCO0FBR3BCQyxTQUFPLEVBSGE7QUFJcEJDLFVBQVEsRUFKWTtBQUtwQkMsU0FBTyxFQUxhO0FBTXBCQyxXQUFTO0FBTlcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0T2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnlcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IDUwLFxuICAgIHN0eWxlOiB7fSxcbiAgICBub2RlUmVmOiBudWxsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHN0eWxlLFxuICAgICAgbm9kZVJlZixcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB4PXt4fVxuICAgICAgICB5PXt5fVxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIHJlZj17bm9kZVJlZn1cbiAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==