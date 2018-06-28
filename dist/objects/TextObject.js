function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class TextObject extends Component {
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
      style,
      text,
      nodeRef
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["style", "text", "nodeRef"]);

    delete style.stroke; // ignore stroke, only use fill.

    return React.createElement("text", _extends({
      style: style,
      ref: nodeRef
    }, otherProps), text);
  }

}

_defineProperty(TextObject, "propTypes", {
  x: PropTypes.number,
  y: PropTypes.number,
  style: PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
  }),
  text: PropTypes.string,
  nodeRef: PropTypes.any
});

_defineProperty(TextObject, "defaultProps", {
  x: 0,
  y: 0,
  style: {},
  text: '',
  nodeRef: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL1RleHRPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwibmV4dFByb3BzIiwiZXF1YWwiLCJPYmplY3QiLCJlbnRyaWVzIiwiZXZlcnkiLCJrZXkiLCJ2YWx1ZSIsIkZ1bmN0aW9uIiwicHJvcHMiLCJyZW5kZXIiLCJzdHlsZSIsInRleHQiLCJub2RlUmVmIiwib3RoZXJQcm9wcyIsInN0cm9rZSIsIngiLCJudW1iZXIiLCJ5Iiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwiYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJGLFNBQXpCLENBQW1DO0FBQUE7QUFBQTs7QUFBQSxtREFvQnZCRyxTQUFELElBQWU7QUFDckMsWUFBTUMsUUFBUUMsT0FBT0MsT0FBUCxDQUFlSCxTQUFmLEVBQTBCSSxLQUExQixDQUFnQyxDQUFDLENBQUNDLEdBQUQsRUFBTUMsS0FBTixDQUFELEtBQWtCO0FBQzlELFlBQUlBLGlCQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsaUJBQU8sSUFBUCxDQUQ2QixDQUNoQjtBQUNkOztBQUVELGVBQU8sS0FBS0MsS0FBTCxDQUFXSCxHQUFYLE1BQW9CQyxLQUEzQjtBQUNELE9BTmEsQ0FBZDtBQVFBLGFBQU8sQ0FBQ0wsS0FBUixDQVRxQyxDQVN0QjtBQUNoQixLQTlCK0M7QUFBQTs7QUFnQ2hEUSxXQUFTO0FBQ1Asd0JBS0ksS0FBS0QsS0FMVDtBQUFBLFVBQU07QUFDSkUsV0FESTtBQUVKQyxVQUZJO0FBR0pDO0FBSEksS0FBTjtBQUFBLFVBSUtDLFVBSkw7O0FBTUEsV0FBT0gsTUFBTUksTUFBYixDQVBPLENBT2M7O0FBRXJCLFdBQ0U7QUFBTSxhQUFPSixLQUFiO0FBQW9CLFdBQUtFO0FBQXpCLE9BQXNDQyxVQUF0QyxHQUNHRixJQURILENBREY7QUFLRDs7QUE5QytDOztnQkFBN0JaLFUsZUFDQTtBQUNqQmdCLEtBQUdqQixVQUFVa0IsTUFESTtBQUVqQkMsS0FBR25CLFVBQVVrQixNQUZJO0FBR2pCTixTQUFPWixVQUFVb0IsS0FBVixDQUFnQjtBQUNyQkMsVUFBTXJCLFVBQVVzQixNQURLO0FBRXJCTixZQUFRaEIsVUFBVXNCO0FBRkcsR0FBaEIsQ0FIVTtBQU9qQlQsUUFBTWIsVUFBVXNCLE1BUEM7QUFRakJSLFdBQVNkLFVBQVV1QjtBQVJGLEM7O2dCQURBdEIsVSxrQkFZRztBQUNwQmdCLEtBQUcsQ0FEaUI7QUFFcEJFLEtBQUcsQ0FGaUI7QUFHcEJQLFNBQU8sRUFIYTtBQUlwQkMsUUFBTSxFQUpjO0FBS3BCQyxXQUFTO0FBTFcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0T2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgdGV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBub2RlUmVmOiBQcm9wVHlwZXMuYW55XG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICBzdHlsZToge30sXG4gICAgdGV4dDogJycsXG4gICAgbm9kZVJlZjogbnVsbFxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gKG5leHRQcm9wcykgPT4ge1xuICAgIGNvbnN0IGVxdWFsID0gT2JqZWN0LmVudHJpZXMobmV4dFByb3BzKS5ldmVyeSgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gd2Ugd29uJ3QgY2hhbmdlIGZ1bmN0aW9uc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wc1trZXldID09PSB2YWx1ZTtcbiAgICB9KVxuXG4gICAgcmV0dXJuICFlcXVhbDsgLy8gb25seSB1cGRhdGUgaWYgYSBwcm9wIGFjdHVhbGx5IGNoYW5nZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSxcbiAgICAgIHRleHQsXG4gICAgICBub2RlUmVmLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGRlbGV0ZSBzdHlsZS5zdHJva2U7IC8vIGlnbm9yZSBzdHJva2UsIG9ubHkgdXNlIGZpbGwuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHRleHQgc3R5bGU9e3N0eWxlfSByZWY9e25vZGVSZWZ9IHsuLi5vdGhlclByb3BzfT5cbiAgICAgICAge3RleHR9XG4gICAgICA8L3RleHQ+XG4gICAgKTtcbiAgfVxufVxuIl19