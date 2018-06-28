function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class RectObject extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "shouldComponentUpdate", nextProps => {
      const equal = Object.entries(nextProps).every(([key, value]) => {
        if (value instanceof Function) {
          return true; // we won't change functions
        }

        return this.props[key] === value;
      });
      return !equal; // only update if a prop actually changed
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1JlY3RPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJSZWN0T2JqZWN0IiwibmV4dFByb3BzIiwiZXF1YWwiLCJPYmplY3QiLCJlbnRyaWVzIiwiZXZlcnkiLCJrZXkiLCJ2YWx1ZSIsIkZ1bmN0aW9uIiwicHJvcHMiLCJyZW5kZXIiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJub2RlUmVmIiwib3RoZXJQcm9wcyIsIm51bWJlciIsInNoYXBlIiwiZmlsbCIsInN0cmluZyIsInN0cm9rZSIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsZUFBZSxNQUFNQyxVQUFOLFNBQXlCRixTQUF6QixDQUFtQztBQUFBO0FBQUE7O0FBQUEsbURBc0J2QkcsU0FBRCxJQUFlO0FBQ3JDLFlBQU1DLFFBQVFDLE9BQU9DLE9BQVAsQ0FBZUgsU0FBZixFQUEwQkksS0FBMUIsQ0FBZ0MsQ0FBQyxDQUFDQyxHQUFELEVBQU1DLEtBQU4sQ0FBRCxLQUFrQjtBQUM5RCxZQUFJQSxpQkFBaUJDLFFBQXJCLEVBQStCO0FBQzdCLGlCQUFPLElBQVAsQ0FENkIsQ0FDaEI7QUFDZDs7QUFFRCxlQUFPLEtBQUtDLEtBQUwsQ0FBV0gsR0FBWCxNQUFvQkMsS0FBM0I7QUFDRCxPQU5hLENBQWQ7QUFRQSxhQUFPLENBQUNMLEtBQVIsQ0FUcUMsQ0FTdEI7QUFDaEIsS0FoQytDO0FBQUE7O0FBa0NoRFEsV0FBUztBQUNQLHdCQVFJLEtBQUtELEtBUlQ7QUFBQSxVQUFNO0FBQ0pFLE9BREk7QUFFSkMsT0FGSTtBQUdKQyxXQUhJO0FBSUpDLFlBSkk7QUFLSkMsV0FMSTtBQU1KQztBQU5JLEtBQU47QUFBQSxVQU9LQyxVQVBMOztBQVVBLFdBQ0U7QUFDRSxTQUFHTixDQURMO0FBRUUsU0FBR0MsQ0FGTDtBQUdFLGFBQU9DLEtBSFQ7QUFJRSxjQUFRQyxNQUpWO0FBS0UsYUFBT0MsS0FMVDtBQU1FLFdBQUtDO0FBTlAsT0FPTUMsVUFQTixFQURGO0FBV0Q7O0FBeEQrQzs7Z0JBQTdCakIsVSxlQUNBO0FBQ2pCVyxLQUFHWixVQUFVbUIsTUFESTtBQUVqQk4sS0FBR2IsVUFBVW1CLE1BRkk7QUFHakJMLFNBQU9kLFVBQVVtQixNQUhBO0FBSWpCSixVQUFRZixVQUFVbUIsTUFKRDtBQUtqQkgsU0FBT2hCLFVBQVVvQixLQUFWLENBQWdCO0FBQ3JCQyxVQUFNckIsVUFBVXNCLE1BREs7QUFFckJDLFlBQVF2QixVQUFVc0I7QUFGRyxHQUFoQixDQUxVO0FBU2pCTCxXQUFTakIsVUFBVXdCO0FBVEYsQzs7Z0JBREF2QixVLGtCQWFHO0FBQ3BCVyxLQUFHLENBRGlCO0FBRXBCQyxLQUFHLENBRmlCO0FBR3BCQyxTQUFPLEVBSGE7QUFJcEJDLFVBQVEsRUFKWTtBQUtwQkMsU0FBTyxFQUxhO0FBTXBCQyxXQUFTO0FBTlcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0T2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnlcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IDUwLFxuICAgIHN0eWxlOiB7fSxcbiAgICBub2RlUmVmOiBudWxsXG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUgPSAobmV4dFByb3BzKSA9PiB7XG4gICAgY29uc3QgZXF1YWwgPSBPYmplY3QuZW50cmllcyhuZXh0UHJvcHMpLmV2ZXJ5KChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyB3ZSB3b24ndCBjaGFuZ2UgZnVuY3Rpb25zXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnByb3BzW2tleV0gPT09IHZhbHVlO1xuICAgIH0pXG5cbiAgICByZXR1cm4gIWVxdWFsOyAvLyBvbmx5IHVwZGF0ZSBpZiBhIHByb3AgYWN0dWFsbHkgY2hhbmdlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBzdHlsZSxcbiAgICAgIG5vZGVSZWYsXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgeD17eH1cbiAgICAgICAgeT17eX1cbiAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICByZWY9e25vZGVSZWZ9XG4gICAgICAgIHsuLi5vdGhlclByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=