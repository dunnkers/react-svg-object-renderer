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

  /**
   * Getter to ensure nested defaults are attached to object
   */
  getStyle() {
    const DEFAULTS = RectObject.defaultProps.style;
    return Object.assign({}, this.props.style || {}, DEFAULTS);
  }

  render() {
    const _this$props = this.props,
          {
      x,
      y,
      width,
      height,
      nodeRef
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["x", "y", "width", "height", "nodeRef"]);

    delete otherProps.type; // don't attach type as attribute

    return React.createElement("rect", _extends({
      x: x,
      y: y,
      width: width,
      height: height,
      style: this.getStyle(),
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
  style: {
    fill: 'white',
    stroke: 'black'
  },
  nodeRef: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1JlY3RPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJSZWN0T2JqZWN0IiwibmV4dFByb3BzIiwiZXF1YWwiLCJPYmplY3QiLCJlbnRyaWVzIiwiZXZlcnkiLCJrZXkiLCJ2YWx1ZSIsIkZ1bmN0aW9uIiwicHJvcHMiLCJnZXRTdHlsZSIsIkRFRkFVTFRTIiwiZGVmYXVsdFByb3BzIiwic3R5bGUiLCJhc3NpZ24iLCJyZW5kZXIiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwibm9kZVJlZiIsIm90aGVyUHJvcHMiLCJ0eXBlIiwibnVtYmVyIiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwic3Ryb2tlIiwiYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJGLFNBQXpCLENBQW1DO0FBQUE7QUFBQTs7QUFBQSxtREF5QnZCRyxTQUFELElBQWU7QUFDckMsWUFBTUMsUUFBUUMsT0FBT0MsT0FBUCxDQUFlSCxTQUFmLEVBQTBCSSxLQUExQixDQUFnQyxDQUFDLENBQUNDLEdBQUQsRUFBTUMsS0FBTixDQUFELEtBQWtCO0FBQzlELFlBQUlBLGlCQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsaUJBQU8sSUFBUCxDQUQ2QixDQUNoQjtBQUNkOztBQUVELGVBQU8sS0FBS0MsS0FBTCxDQUFXSCxHQUFYLE1BQW9CQyxLQUEzQjtBQUNELE9BTmEsQ0FBZDtBQVFBLGFBQU8sQ0FBQ0wsS0FBUixDQVRxQyxDQVN0QjtBQUNoQixLQW5DK0M7QUFBQTs7QUFxQ2hEOzs7QUFHQVEsYUFBVztBQUNULFVBQU1DLFdBQVdYLFdBQVdZLFlBQVgsQ0FBd0JDLEtBQXpDO0FBQ0EsV0FBT1YsT0FBT1csTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0wsS0FBTCxDQUFXSSxLQUFYLElBQW9CLEVBQXRDLEVBQTBDRixRQUExQyxDQUFQO0FBQ0Q7O0FBRURJLFdBQVM7QUFDUCx3QkFPSSxLQUFLTixLQVBUO0FBQUEsVUFBTTtBQUNKTyxPQURJO0FBRUpDLE9BRkk7QUFHSkMsV0FISTtBQUlKQyxZQUpJO0FBS0pDO0FBTEksS0FBTjtBQUFBLFVBTUtDLFVBTkw7O0FBUUEsV0FBT0EsV0FBV0MsSUFBbEIsQ0FUTyxDQVNpQjs7QUFFeEIsV0FDRTtBQUNFLFNBQUdOLENBREw7QUFFRSxTQUFHQyxDQUZMO0FBR0UsYUFBT0MsS0FIVDtBQUlFLGNBQVFDLE1BSlY7QUFLRSxhQUFPLEtBQUtULFFBQUwsRUFMVDtBQU1FLFdBQUtVO0FBTlAsT0FPTUMsVUFQTixFQURGO0FBV0Q7O0FBbkUrQzs7Z0JBQTdCckIsVSxlQUNBO0FBQ2pCZ0IsS0FBR2pCLFVBQVV3QixNQURJO0FBRWpCTixLQUFHbEIsVUFBVXdCLE1BRkk7QUFHakJMLFNBQU9uQixVQUFVd0IsTUFIQTtBQUlqQkosVUFBUXBCLFVBQVV3QixNQUpEO0FBS2pCVixTQUFPZCxVQUFVeUIsS0FBVixDQUFnQjtBQUNyQkMsVUFBTTFCLFVBQVUyQixNQURLO0FBRXJCQyxZQUFRNUIsVUFBVTJCO0FBRkcsR0FBaEIsQ0FMVTtBQVNqQk4sV0FBU3JCLFVBQVU2QjtBQVRGLEM7O2dCQURBNUIsVSxrQkFhRztBQUNwQmdCLEtBQUcsQ0FEaUI7QUFFcEJDLEtBQUcsQ0FGaUI7QUFHcEJDLFNBQU8sRUFIYTtBQUlwQkMsVUFBUSxFQUpZO0FBS3BCTixTQUFPO0FBQ0xZLFVBQU0sT0FERDtBQUVMRSxZQUFRO0FBRkgsR0FMYTtBQVNwQlAsV0FBUztBQVRXLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdE9iamVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzdHlsZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGZpbGw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBzdHJva2U6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9KSxcbiAgICBub2RlUmVmOiBQcm9wVHlwZXMuYW55XG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB3aWR0aDogNTAsXG4gICAgaGVpZ2h0OiA1MCxcbiAgICBzdHlsZToge1xuICAgICAgZmlsbDogJ3doaXRlJyxcbiAgICAgIHN0cm9rZTogJ2JsYWNrJ1xuICAgIH0sXG4gICAgbm9kZVJlZjogbnVsbFxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gKG5leHRQcm9wcykgPT4ge1xuICAgIGNvbnN0IGVxdWFsID0gT2JqZWN0LmVudHJpZXMobmV4dFByb3BzKS5ldmVyeSgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gd2Ugd29uJ3QgY2hhbmdlIGZ1bmN0aW9uc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wc1trZXldID09PSB2YWx1ZTtcbiAgICB9KVxuXG4gICAgcmV0dXJuICFlcXVhbDsgLy8gb25seSB1cGRhdGUgaWYgYSBwcm9wIGFjdHVhbGx5IGNoYW5nZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgdG8gZW5zdXJlIG5lc3RlZCBkZWZhdWx0cyBhcmUgYXR0YWNoZWQgdG8gb2JqZWN0XG4gICAqL1xuICBnZXRTdHlsZSgpIHtcbiAgICBjb25zdCBERUZBVUxUUyA9IFJlY3RPYmplY3QuZGVmYXVsdFByb3BzLnN0eWxlO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnN0eWxlIHx8IHt9LCBERUZBVUxUUyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIG5vZGVSZWYsXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgZGVsZXRlIG90aGVyUHJvcHMudHlwZTsgLy8gZG9uJ3QgYXR0YWNoIHR5cGUgYXMgYXR0cmlidXRlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgeD17eH1cbiAgICAgICAgeT17eX1cbiAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoKX1cbiAgICAgICAgcmVmPXtub2RlUmVmfVxuICAgICAgICB7Li4ub3RoZXJQcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19