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
  nodeRef: PropTypes.any.isRequired
});

_defineProperty(CellObject, "defaultProps", {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  style: {
    fill: 'white',
    stroke: 'black'
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJyZW5kZXIiLCJwcm9wcyIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzdHlsZSIsIm5vZGVSZWYiLCJ2YWx1ZSIsInRleHRTdHlsZSIsIm90aGVyUHJvcHMiLCJudW1iZXIiLCJzaGFwZSIsImZpbGwiLCJzdHJpbmciLCJzdHJva2UiLCJhbnkiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUVBLGVBQWUsTUFBTUMsVUFBTixTQUF5QkosU0FBekIsQ0FBbUM7QUF3QmhESyxXQUFTO0FBQ1Asd0JBVUksS0FBS0MsS0FWVDtBQUFBLFVBQU07QUFDSkMsT0FESTtBQUVKQyxPQUZJO0FBR0pDLFdBSEk7QUFJSkMsWUFKSTtBQUtKQyxXQUxJO0FBTUpDLGFBTkk7QUFPSkMsV0FQSTtBQVFKQztBQVJJLEtBQU47QUFBQSxVQVNLQyxVQVRMOztBQVlBLFdBQ0UsK0JBQ0Usb0JBQUMsVUFBRDtBQUNFLFNBQUdSLENBREw7QUFFRSxTQUFHQyxDQUZMO0FBR0UsYUFBT0MsS0FIVDtBQUlFLGNBQVFDLE1BSlY7QUFLRSxhQUFPQyxLQUxUO0FBTUUsZUFBU0M7QUFOWCxPQU9NRyxVQVBOLEVBREYsRUFVRSxvQkFBQyxVQUFEO0FBQ0UsU0FBR1IsSUFBSUUsUUFBUSxDQURqQjtBQUVFLFNBQUdELElBQUlFLFNBQVMsQ0FGbEI7QUFHRSxZQUFNRyxLQUhSO0FBSUUscUJBQWMsTUFKaEI7QUFLRSxrQkFBVyxRQUxiO0FBTUUsd0JBQWlCLFFBTm5CO0FBT0UsYUFBT0M7QUFQVCxNQVZGLENBREY7QUFzQkQ7O0FBM0QrQzs7Z0JBQTdCVixVLGVBQ0E7QUFDakJHLEtBQUdOLFVBQVVlLE1BREk7QUFFakJSLEtBQUdQLFVBQVVlLE1BRkk7QUFHakJQLFNBQU9SLFVBQVVlLE1BSEE7QUFJakJOLFVBQVFULFVBQVVlLE1BSkQ7QUFLakJMLFNBQU9WLFVBQVVnQixLQUFWLENBQWdCO0FBQ3JCQyxVQUFNakIsVUFBVWtCLE1BREs7QUFFckJDLFlBQVFuQixVQUFVa0I7QUFGRyxHQUFoQixDQUxVO0FBU2pCUCxXQUFTWCxVQUFVb0IsR0FBVixDQUFjQztBQVROLEM7O2dCQURBbEIsVSxrQkFhRztBQUNwQkcsS0FBRyxDQURpQjtBQUVwQkMsS0FBRyxDQUZpQjtBQUdwQkMsU0FBTyxFQUhhO0FBSXBCQyxVQUFRLEVBSlk7QUFLcEJDLFNBQU87QUFDTE8sVUFBTSxPQUREO0FBRUxFLFlBQVE7QUFGSDtBQUxhLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBUZXh0T2JqZWN0IGZyb20gJy4vVGV4dE9iamVjdCc7XG5pbXBvcnQgUmVjdE9iamVjdCBmcm9tICcuL1JlY3RPYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZWxsT2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgc3R5bGU6IHtcbiAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICBzdHJva2U6ICdibGFjaydcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHN0eWxlLFxuICAgICAgbm9kZVJlZixcbiAgICAgIHZhbHVlLFxuICAgICAgdGV4dFN0eWxlLFxuICAgICAgLi4ub3RoZXJQcm9wc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnPlxuICAgICAgICA8UmVjdE9iamVjdFxuICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgeT17eX1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIG5vZGVSZWY9e25vZGVSZWZ9XG4gICAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0T2JqZWN0XG4gICAgICAgICAgeD17eCArIHdpZHRoIC8gMn1cbiAgICAgICAgICB5PXt5ICsgaGVpZ2h0IC8gMn1cbiAgICAgICAgICB0ZXh0PXt2YWx1ZX1cbiAgICAgICAgICBwb2ludGVyRXZlbnRzPVwibm9uZVwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgc3R5bGU9e3RleHRTdHlsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9XG59XG4iXX0=