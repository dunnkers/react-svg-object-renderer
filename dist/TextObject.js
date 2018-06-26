function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class TextObject extends Component {
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
  nodeRef: PropTypes.any.isRequired
});

_defineProperty(TextObject, "defaultProps", {
  x: 0,
  y: 0,
  style: {},
  text: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXh0T2JqZWN0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiVGV4dE9iamVjdCIsInJlbmRlciIsInByb3BzIiwic3R5bGUiLCJ0ZXh0Iiwibm9kZVJlZiIsIm90aGVyUHJvcHMiLCJzdHJva2UiLCJ4IiwibnVtYmVyIiwieSIsInNoYXBlIiwiZmlsbCIsInN0cmluZyIsImFueSIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkYsU0FBekIsQ0FBbUM7QUFtQmhERyxXQUFTO0FBQ1Asd0JBS0ksS0FBS0MsS0FMVDtBQUFBLFVBQU07QUFDSkMsV0FESTtBQUVKQyxVQUZJO0FBR0pDO0FBSEksS0FBTjtBQUFBLFVBSUtDLFVBSkw7O0FBTUEsV0FBT0gsTUFBTUksTUFBYixDQVBPLENBT2M7O0FBRXJCLFdBQ0U7QUFBTSxhQUFPSixLQUFiO0FBQW9CLFdBQUtFO0FBQXpCLE9BQXNDQyxVQUF0QyxHQUNHRixJQURILENBREY7QUFLRDs7QUFqQytDOztnQkFBN0JKLFUsZUFDQTtBQUNqQlEsS0FBR1QsVUFBVVUsTUFESTtBQUVqQkMsS0FBR1gsVUFBVVUsTUFGSTtBQUdqQk4sU0FBT0osVUFBVVksS0FBVixDQUFnQjtBQUNyQkMsVUFBTWIsVUFBVWMsTUFESztBQUVyQk4sWUFBUVIsVUFBVWM7QUFGRyxHQUFoQixDQUhVO0FBT2pCVCxRQUFNTCxVQUFVYyxNQVBDO0FBUWpCUixXQUFTTixVQUFVZSxHQUFWLENBQWNDO0FBUk4sQzs7Z0JBREFmLFUsa0JBWUc7QUFDcEJRLEtBQUcsQ0FEaUI7QUFFcEJFLEtBQUcsQ0FGaUI7QUFHcEJQLFNBQU8sRUFIYTtBQUlwQkMsUUFBTTtBQUpjLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dE9iamVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIHRleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbm9kZVJlZjogUHJvcFR5cGVzLmFueS5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICBzdHlsZToge30sXG4gICAgdGV4dDogJydcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSxcbiAgICAgIHRleHQsXG4gICAgICBub2RlUmVmLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGRlbGV0ZSBzdHlsZS5zdHJva2U7IC8vIGlnbm9yZSBzdHJva2UsIG9ubHkgdXNlIGZpbGwuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHRleHQgc3R5bGU9e3N0eWxlfSByZWY9e25vZGVSZWZ9IHsuLi5vdGhlclByb3BzfT5cbiAgICAgICAge3RleHR9XG4gICAgICA8L3RleHQ+XG4gICAgKTtcbiAgfVxufVxuIl19