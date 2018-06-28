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

  getStyle() {
    const DEFAULTS = RectObject.defaultProps.style;
    return Object.assign({}, DEFAULTS, this.props.style || {});
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
      style: this.getStyle(),
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
  /**
   * Getter to ensure nested defaults are attached to object
   */

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vYmplY3RzL0NlbGxPYmplY3QuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJUZXh0T2JqZWN0IiwiUmVjdE9iamVjdCIsIkNlbGxPYmplY3QiLCJuZXh0UHJvcHMiLCJlcXVhbCIsIk9iamVjdCIsImVudHJpZXMiLCJldmVyeSIsImtleSIsInZhbHVlIiwiRnVuY3Rpb24iLCJwcm9wcyIsImdldFN0eWxlIiwiREVGQVVMVFMiLCJkZWZhdWx0UHJvcHMiLCJzdHlsZSIsImFzc2lnbiIsInJlbmRlciIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJub2RlUmVmIiwidGV4dFN0eWxlIiwib3RoZXJQcm9wcyIsIm51bWJlciIsInNoYXBlIiwiZmlsbCIsInN0cmluZyIsInN0cm9rZSIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFFQSxlQUFlLE1BQU1DLFVBQU4sU0FBeUJKLFNBQXpCLENBQW1DO0FBQUE7QUFBQTs7QUFBQSxtREFpQ3ZCSyxTQUFELElBQWU7QUFDckMsWUFBTUMsUUFBUUMsT0FBT0MsT0FBUCxDQUFlSCxTQUFmLEVBQTBCSSxLQUExQixDQUFnQyxDQUFDLENBQUNDLEdBQUQsRUFBTUMsS0FBTixDQUFELEtBQWtCO0FBQzlELFlBQUlBLGlCQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsaUJBQU8sSUFBUCxDQUQ2QixDQUNoQjtBQUNkOztBQUVELGVBQU8sS0FBS0MsS0FBTCxDQUFXSCxHQUFYLE1BQW9CQyxLQUEzQjtBQUNELE9BTmEsQ0FBZDtBQVFBLGFBQU8sQ0FBQ0wsS0FBUixDQVRxQyxDQVN0QjtBQUNoQixLQTNDK0M7QUFBQTs7QUE0QmhEUSxhQUFXO0FBQ1QsVUFBTUMsV0FBV1osV0FBV2EsWUFBWCxDQUF3QkMsS0FBekM7QUFDQSxXQUFPVixPQUFPVyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsUUFBbEIsRUFBNEIsS0FBS0YsS0FBTCxDQUFXSSxLQUFYLElBQW9CLEVBQWhELENBQVA7QUFDRDs7QUFjREUsV0FBUztBQUNQLHdCQVVJLEtBQUtOLEtBVlQ7QUFBQSxVQUFNO0FBQ0pPLE9BREk7QUFFSkMsT0FGSTtBQUdKQyxXQUhJO0FBSUpDLFlBSkk7QUFLSk4sV0FMSTtBQU1KTyxhQU5JO0FBT0piLFdBUEk7QUFRSmM7QUFSSSxLQUFOO0FBQUEsVUFTS0MsVUFUTDs7QUFZQSxXQUNFLCtCQUNFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHTixDQURMO0FBRUUsU0FBR0MsQ0FGTDtBQUdFLGFBQU9DLEtBSFQ7QUFJRSxjQUFRQyxNQUpWO0FBS0UsYUFBTyxLQUFLVCxRQUFMLEVBTFQ7QUFNRSxlQUFTVTtBQU5YLE9BT01FLFVBUE4sRUFERixFQVVFLG9CQUFDLFVBQUQ7QUFDRSxTQUFHTixJQUFJRSxRQUFRLENBRGpCO0FBRUUsU0FBR0QsSUFBSUUsU0FBUyxDQUZsQjtBQUdFLFlBQU1aLEtBSFI7QUFJRSxxQkFBYyxNQUpoQjtBQUtFLGtCQUFXLFFBTGI7QUFNRSx3QkFBaUIsUUFObkI7QUFPRSxhQUFPYztBQVBULE1BVkYsQ0FERjtBQXNCRDs7QUFoRitDOztnQkFBN0JyQixVLGVBQ0E7QUFDakJnQixLQUFHbkIsVUFBVTBCLE1BREk7QUFFakJOLEtBQUdwQixVQUFVMEIsTUFGSTtBQUdqQkwsU0FBT3JCLFVBQVUwQixNQUhBO0FBSWpCSixVQUFRdEIsVUFBVTBCLE1BSkQ7QUFLakJWLFNBQU9oQixVQUFVMkIsS0FBVixDQUFnQjtBQUNyQkMsVUFBTTVCLFVBQVU2QixNQURLO0FBRXJCQyxZQUFROUIsVUFBVTZCO0FBRkcsR0FBaEIsQ0FMVTtBQVNqQk4sV0FBU3ZCLFVBQVUrQjtBQVRGLEM7O2dCQURBNUIsVSxrQkFhRztBQUNwQmdCLEtBQUcsQ0FEaUI7QUFFcEJDLEtBQUcsQ0FGaUI7QUFHcEJDLFNBQU8sRUFIYTtBQUlwQkMsVUFBUSxFQUpZO0FBS3BCTixTQUFPO0FBQ0xZLFVBQU0sT0FERDtBQUVMRSxZQUFRO0FBRkgsR0FMYTtBQVNwQlAsV0FBUztBQUdYOzs7O0FBWnNCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBUZXh0T2JqZWN0IGZyb20gJy4vVGV4dE9iamVjdCc7XG5pbXBvcnQgUmVjdE9iamVjdCBmcm9tICcuL1JlY3RPYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZWxsT2JqZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0cm9rZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pLFxuICAgIG5vZGVSZWY6IFByb3BUeXBlcy5hbnlcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IDUwLFxuICAgIHN0eWxlOiB7XG4gICAgICBmaWxsOiAnd2hpdGUnLFxuICAgICAgc3Ryb2tlOiAnYmxhY2snXG4gICAgfSxcbiAgICBub2RlUmVmOiBudWxsXG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIHRvIGVuc3VyZSBuZXN0ZWQgZGVmYXVsdHMgYXJlIGF0dGFjaGVkIHRvIG9iamVjdFxuICAgKi9cbiAgZ2V0U3R5bGUoKSB7XG4gICAgY29uc3QgREVGQVVMVFMgPSBSZWN0T2JqZWN0LmRlZmF1bHRQcm9wcy5zdHlsZTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVFMsIHRoaXMucHJvcHMuc3R5bGUgfHwge30pO1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gKG5leHRQcm9wcykgPT4ge1xuICAgIGNvbnN0IGVxdWFsID0gT2JqZWN0LmVudHJpZXMobmV4dFByb3BzKS5ldmVyeSgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gd2Ugd29uJ3QgY2hhbmdlIGZ1bmN0aW9uc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wc1trZXldID09PSB2YWx1ZTtcbiAgICB9KVxuXG4gICAgcmV0dXJuICFlcXVhbDsgLy8gb25seSB1cGRhdGUgaWYgYSBwcm9wIGFjdHVhbGx5IGNoYW5nZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgc3R5bGUsXG4gICAgICBub2RlUmVmLFxuICAgICAgdmFsdWUsXG4gICAgICB0ZXh0U3R5bGUsXG4gICAgICAuLi5vdGhlclByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGc+XG4gICAgICAgIDxSZWN0T2JqZWN0XG4gICAgICAgICAgeD17eH1cbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzdHlsZT17dGhpcy5nZXRTdHlsZSgpfVxuICAgICAgICAgIG5vZGVSZWY9e25vZGVSZWZ9XG4gICAgICAgICAgey4uLm90aGVyUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0T2JqZWN0XG4gICAgICAgICAgeD17eCArIHdpZHRoIC8gMn1cbiAgICAgICAgICB5PXt5ICsgaGVpZ2h0IC8gMn1cbiAgICAgICAgICB0ZXh0PXt2YWx1ZX1cbiAgICAgICAgICBwb2ludGVyRXZlbnRzPVwibm9uZVwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgc3R5bGU9e3RleHRTdHlsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9XG59XG4iXX0=