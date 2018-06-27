function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import HoverRect from './indicators/HoverRect';
import SelectRect from './indicators/SelectRect';
import Surface from './Surface';
import HotKeyProvider from './HotKeyProvider';
import SVGRoot from './SVGRoot';
import { getBBox } from './Common';
export default class SVGObjectRenderer extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      isHovering: false,
      currentlyHovering: null,
      selectedObjects: new Set(),
      multiSelect: false,
      selectedType: null
    });

    _defineProperty(this, "onMouseOver", index => {
      this.setState({
        isHovering: true,
        currentlyHovering: index
      });
    });

    _defineProperty(this, "onMouseLeave", () => this.setState({
      isHovering: false
    }));

    _defineProperty(this, "selectObjects", indices => {
      const newSelection = new Set(indices);
      this.setState({
        selectedObjects: newSelection
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(newSelection));
    });

    _defineProperty(this, "onMouseDown", (index, event) => {
      event.preventDefault(); // 💡 Prevents user selecting any svg text

      const newSelection = this.computeSelection(index);
      this.setState({
        selectedObjects: newSelection
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(newSelection));
    });

    _defineProperty(this, "isSelectedType", index => this.props.objects[index].type === this.state.selectedType);

    _defineProperty(this, "shouldRenderHover", index => {
      const {
        isHovering,
        selectedObjects,
        multiSelect
      } = this.state;
      const {
        multipleTypeSelection
      } = this.props; // don't render when object already selected

      if (!isHovering || selectedObjects.has(index)) {
        return false;
      } // don't render when selecting objects of same type


      if (selectedObjects.size > 0 && multiSelect) {
        return this.isSelectedType(index) || multipleTypeSelection;
      }

      return true;
    });

    _defineProperty(this, "renderObject", (object, index) => {
      const {
        objectTypes
      } = this.props;
      const ObjectComponent = objectTypes[object.type];
      return React.createElement(ObjectComponent, _extends({}, object, {
        key: index,
        nodeRef: this.objectRefs[index],
        onMouseOver: () => this.onMouseOver(index),
        onMouseDown: event => this.onMouseDown(index, event),
        onMouseLeave: this.onMouseLeave
      }));
    });

    _defineProperty(this, "deselectAll", () => {
      if (this.state.selectedObjects.size > 0) {
        const selectedObjects = new Set();
        this.setState({
          selectedObjects
        }); // ⚡ notify outside world of selection change. convert set to array.

        this.props.onSelectionChange(Array.from(selectedObjects));
      }
    });

    this.objectRefs = Object.entries(props.objects).map(() => createRef());
  }

  multiSelect(index, objects) {
    if (objects.has(index)) {
      // remove from selection
      objects.delete(index);
      return objects;
    } else {
      // add to selection
      // possibly, dissalow selecting another type
      const {
        multipleTypeSelection
      } = this.props;
      const sameType = this.isSelectedType(index) || multipleTypeSelection;
      return sameType ? objects.add(index) : objects;
    }
  }

  singleSelect(index, objects) {
    if (objects.has(index)) {
      // deselect
      objects.clear();
      return objects;
    } else {
      // select
      objects.clear();
      this.setState({
        selectedType: this.props.objects[index].type
      });
      return objects.add(index);
    }
  }

  computeSelection(index) {
    const {
      selectedObjects,
      multiSelect
    } = this.state;

    if (multiSelect && selectedObjects.size > 0) {
      return this.multiSelect(index, selectedObjects);
    } else {
      return this.singleSelect(index, selectedObjects);
    }
  }

  render() {
    const {
      width,
      height,
      objects
    } = this.props;
    const dimensions = {
      width,
      height
    };
    const {
      currentlyHovering,
      selectedObjects
    } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    const renderHover = this.shouldRenderHover(currentlyHovering);
    return React.createElement(HotKeyProvider, _extends({}, dimensions, {
      setMultiSelect: multiSelect => this.setState({
        multiSelect
      })
    }), React.createElement(SVGRoot, _extends({}, dimensions, {
      selectables: this.objectRefs,
      selectIndices: indices => this.selectObjects(indices)
    }), React.createElement(Surface, {
      deselectAll: this.deselectAll
    }), objects.map(this.renderObject), renderHover && React.createElement(HoverRect, _extends({}, getBBox(this.objectRefs[currentlyHovering]), {
      stopHover: this.onMouseLeave
    })), selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, getBBox(this.objectRefs[objectIndex]), {
      key: index,
      select: event => this.onMouseDown(objectIndex, event)
    })))));
  }

}

_defineProperty(SVGObjectRenderer, "propTypes", {
  width: PropTypes.number,
  height: PropTypes.number,
  objects: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired
  })),
  objectTypes: PropTypes.objectOf(PropTypes.func),
  onSelectionChange: PropTypes.func,
  multipleTypeSelection: PropTypes.bool
});

_defineProperty(SVGObjectRenderer, "defaultProps", {
  width: 400,
  height: 400,
  objects: [],
  objectTypes: {},
  onSelectionChange: () => {},
  multipleTypeSelection: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc0hvdmVyaW5nIiwiY3VycmVudGx5SG92ZXJpbmciLCJzZWxlY3RlZE9iamVjdHMiLCJTZXQiLCJtdWx0aVNlbGVjdCIsInNlbGVjdGVkVHlwZSIsImluZGV4Iiwic2V0U3RhdGUiLCJpbmRpY2VzIiwibmV3U2VsZWN0aW9uIiwib25TZWxlY3Rpb25DaGFuZ2UiLCJBcnJheSIsImZyb20iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZVNlbGVjdGlvbiIsIm9iamVjdHMiLCJ0eXBlIiwic3RhdGUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJzaXplIiwiaXNTZWxlY3RlZFR5cGUiLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsIm9iamVjdFJlZnMiLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VEb3duIiwib25Nb3VzZUxlYXZlIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJyZW5kZXIiLCJ3aWR0aCIsImhlaWdodCIsImRpbWVuc2lvbnMiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJzZWxlY3RPYmplY3RzIiwiZGVzZWxlY3RBbGwiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RP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TFA7QUFNcEJTLHlCQUF1QjtBQU5ILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9Ib3ZlclJlY3QnO1xuaW1wb3J0IFNlbGVjdFJlY3QgZnJvbSAnLi9pbmRpY2F0b3JzL1NlbGVjdFJlY3QnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9TdXJmYWNlJztcbmltcG9ydCBIb3RLZXlQcm92aWRlciBmcm9tICcuL0hvdEtleVByb3ZpZGVyJztcbmltcG9ydCBTVkdSb290IGZyb20gJy4vU1ZHUm9vdCc7XG5pbXBvcnQgeyBnZXRCQm94IH0gZnJvbSAnLi9Db21tb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub2JqZWN0UmVmcyA9IE9iamVjdC5lbnRyaWVzKHByb3BzLm9iamVjdHMpLm1hcCgoKSA9PiBjcmVhdGVSZWYoKSk7XG4gIH1cblxuICBvbk1vdXNlT3ZlciA9IChpbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiB0cnVlLCBjdXJyZW50bHlIb3ZlcmluZzogaW5kZXggfSk7XG4gIH1cblxuICBvbk1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogZmFsc2UgfSlcblxuICBzZWxlY3RPYmplY3RzID0gaW5kaWNlcyA9PiB7XG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gbmV3IFNldChpbmRpY2VzKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb24gfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xuICB9XG5cbiAgb25Nb3VzZURvd24gPSAoaW5kZXgsIGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8g8J+SoSBQcmV2ZW50cyB1c2VyIHNlbGVjdGluZyBhbnkgc3ZnIHRleHRcblxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uXG4gICAgfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xuICB9XG5cbiAgaXNTZWxlY3RlZFR5cGUgPSAoaW5kZXgpID0+XG4gICAgdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkVHlwZTtcblxuICBzaG91bGRSZW5kZXJIb3ZlciA9IChpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgaXNIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKCFpc0hvdmVyaW5nIHx8IHNlbGVjdGVkT2JqZWN0cy5oYXMoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgZGVzZWxlY3RBbGwgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE9iamVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHMgfSk7XG5cbiAgICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShzZWxlY3RlZE9iamVjdHMpKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7IHdpZHRoLCBoZWlnaHQgfTtcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlQcm92aWRlciB7Li4uZGltZW5zaW9uc31cbiAgICAgICAgc2V0TXVsdGlTZWxlY3Q9e211bHRpU2VsZWN0ID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdCB9KX1cbiAgICAgID5cbiAgICAgICAgPFNWR1Jvb3Qgey4uLmRpbWVuc2lvbnN9IHNlbGVjdGFibGVzPXt0aGlzLm9iamVjdFJlZnN9XG4gICAgICAgICAgc2VsZWN0SW5kaWNlcz17aW5kaWNlcyA9PiB0aGlzLnNlbGVjdE9iamVjdHMoaW5kaWNlcyl9PlxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXt0aGlzLmRlc2VsZWN0QWxsfS8+XG5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3JlbmRlckhvdmVyICYmIChcbiAgICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgICAgey4uLmdldEJCb3godGhpcy5vYmplY3RSZWZzW2N1cnJlbnRseUhvdmVyaW5nXSl9XG4gICAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5vbk1vdXNlTGVhdmV9ICBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtzZWxlY3RlZE9iamVjdHNBcnJheS5tYXAoKG9iamVjdEluZGV4LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcbiAgICAgICAgICAgICAgey4uLmdldEJCb3godGhpcy5vYmplY3RSZWZzW29iamVjdEluZGV4XSl9XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKG9iamVjdEluZGV4LCBldmVudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1NWR1Jvb3Q+XG4gICAgICA8L0hvdEtleVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuIl19