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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJuZXh0UHJvcHMiLCJlcXVhbCIsIk9iamVjdCIsImVudHJpZXMiLCJldmVyeSIsImtleSIsInZhbHVlIiwiRnVuY3Rpb24iLCJwcm9wcyIsInJlbmRlciIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHlsZSIsIm5vZGVSZWYiLCJ0ZXh0U3R5bGUiLCJvdGhlclByb3BzIiwibnVtYmVyIiwic2hhcGUiLCJmaWxsIiwic3RyaW5nIiwic3Ryb2tlIiwiYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkosU0FBekIsQ0FBbUM7QUFBQTtBQUFBOztBQUFBLG1EQXlCdkJLLFNBQUQsSUFBZTtBQUNyQyxZQUFNQyxRQUFRQyxPQUFPQyxPQUFQLENBQWVILFNBQWYsRUFBMEJJLEtBQTFCLENBQWdDLENBQUMsQ0FBQ0MsR0FBRCxFQUFNQyxLQUFOLENBQUQsS0FBa0I7QUFDOUQsWUFBSUEsaUJBQWlCQyxRQUFyQixFQUErQjtBQUM3QixpQkFBTyxJQUFQLENBRDZCLENBQ2hCO0FBQ2Q7O0FBRUQsZUFBTyxLQUFLQyxLQUFMLENBQVdILEdBQVgsTUFBb0JDLEtBQTNCO0FBQ0QsT0FOYSxDQUFkO0FBUUEsYUFBTyxDQUFDTCxLQUFSLENBVHFDLENBU3RCO0FBQ2hCLEtBbkMrQztBQUFBOztBQXFDaERRLFdBQVM7QUFDUCx3QkFVSSxLQUFLRCxLQVZUO0FBQUEsVUFBTTtBQUNKRSxPQURJO0FBRUpDLE9BRkk7QUFHSkMsV0FISTtBQUlKQyxZQUpJO0FBS0pDLFdBTEk7QUFNSkMsYUFOSTtBQU9KVCxXQVBJO0FBUUpVO0FBUkksS0FBTjtBQUFBLFVBU0tDLFVBVEw7O0FBWUEsV0FDRSwrQkFDRSxvQkFBQyxVQUFEO0FBQ0UsU0FBR1AsQ0FETDtBQUVFLFNBQUdDLENBRkw7QUFHRSxhQUFPQyxLQUhUO0FBSUUsY0FBUUMsTUFKVjtBQUtFLGFBQU9DLEtBTFQ7QUFNRSxlQUFTQztBQU5YLE9BT01FLFVBUE4sRUFERixFQVVFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHUCxJQUFJRSxRQUFRLENBRGpCO0FBRUUsU0FBR0QsSUFBSUUsU0FBUyxDQUZsQjtBQUdFLFlBQU1QLEtBSFI7QUFJRSxxQkFBYyxNQUpoQjtBQUtFLGtCQUFXLFFBTGI7QUFNRSx3QkFBaUIsUUFObkI7QUFPRSxhQUFPVTtBQVBULE1BVkYsQ0FERjtBQXNCRDs7QUF4RStDOztnQkFBN0JqQixVLGVBQ0E7QUFDakJXLEtBQUdkLFVBQVVzQixNQURJO0FBRWpCUCxLQUFHZixVQUFVc0IsTUFGSTtBQUdqQk4sU0FBT2hCLFVBQVVzQixNQUhBO0FBSWpCTCxVQUFRakIsVUFBVXNCLE1BSkQ7QUFLakJKLFNBQU9sQixVQUFVdUIsS0FBVixDQUFnQjtBQUNyQkMsVUFBTXhCLFVBQVV5QixNQURLO0FBRXJCQyxZQUFRMUIsVUFBVXlCO0FBRkcsR0FBaEIsQ0FMVTtBQVNqQk4sV0FBU25CLFVBQVUyQjtBQVRGLEM7O2dCQURBeEIsVSxrQkFhRztBQUNwQlcsS0FBRyxDQURpQjtBQUVwQkMsS0FBRyxDQUZpQjtBQUdwQkMsU0FBTyxFQUhhO0FBSXBCQyxVQUFRLEVBSlk7QUFLcEJDLFNBQU87QUFDTE0sVUFBTSxPQUREO0FBRUxFLFlBQVE7QUFGSCxHQUxhO0FBU3BCUCxXQUFTO0FBVFcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRleHRPYmplY3QgZnJvbSAnLi9UZXh0T2JqZWN0JztcbmltcG9ydCBSZWN0T2JqZWN0IGZyb20gJy4vUmVjdE9iamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGxPYmplY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3R5bGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3Ryb2tlOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSksXG4gICAgbm9kZVJlZjogUHJvcFR5cGVzLmFueVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgc3R5bGU6IHtcbiAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICBzdHJva2U6ICdibGFjaydcbiAgICB9LFxuICAgIG5vZGVSZWY6IG51bGxcbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSA9IChuZXh0UHJvcHMpID0+IHtcbiAgICBjb25zdCBlcXVhbCA9IE9iamVjdC5lbnRyaWVzKG5leHRQcm9wcykuZXZlcnkoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIHdlIHdvbid0IGNoYW5nZSBmdW5jdGlvbnNcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucHJvcHNba2V5XSA9PT0gdmFsdWU7XG4gICAgfSlcblxuICAgIHJldHVybiAhZXF1YWw7IC8vIG9ubHkgdXBkYXRlIGlmIGEgcHJvcCBhY3R1YWxseSBjaGFuZ2VkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHN0eWxlLFxuICAgICAgbm9kZVJlZixcbiAgICAgIHZhbHVlLFxuICAgICAgdGV4dFN0eWxlLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnPlxuICAgICAgICA8UmVjdE9iamVjdFxuICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgeT17eX1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIG5vZGVSZWY9e25vZGVSZWZ9XG4gICAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0T2JqZWN0XG4gICAgICAgICAgeD17eCArIHdpZHRoIC8gMn1cbiAgICAgICAgICB5PXt5ICsgaGVpZ2h0IC8gMn1cbiAgICAgICAgICB0ZXh0PXt2YWx1ZX1cbiAgICAgICAgICBwb2ludGVyRXZlbnRzPVwibm9uZVwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgc3R5bGU9e3RleHRTdHlsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9XG59XG4iXX0=