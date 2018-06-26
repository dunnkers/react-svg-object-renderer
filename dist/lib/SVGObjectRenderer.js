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

    _defineProperty(this, "selectObjects", indexes => {
      const newSelection = new Set(indexes);
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
        this.setState({
          selectedObjects: new Set()
        }); // ⚡ notify outside world of selection change. convert set to array.

        this.props.onSelectionChange(Array.from(this.state.selectedObjects));
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
      selectables: this.objectRefs
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc0hvdmVyaW5nIiwiY3VycmVudGx5SG92ZXJpbmciLCJzZWxlY3RlZE9iamVjdHMiLCJTZXQiLCJtdWx0aVNlbGVjdCIsInNlbGVjdGVkVHlwZSIsImluZGV4Iiwic2V0U3RhdGUiLCJpbmRleGVzIiwibmV3U2VsZWN0aW9uIiwib25TZWxlY3Rpb25DaGFuZ2UiLCJBcnJheSIsImZyb20iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZVNlbGVjdGlvbiIsIm9iamVjdHMiLCJ0eXBlIiwic3RhdGUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJzaXplIiwiaXNTZWxlY3RlZFR5cGUiLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsIm9iamVjdFJlZnMiLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VEb3duIiwib25Nb3VzZUxlYXZlIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJyZW5kZXIiLCJ3aWR0aCIsImhlaWdodCIsImRpbWVuc2lvbnMiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJkZXNlbGVjdEFsbCIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wi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bnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBIb3ZlclJlY3QgZnJvbSAnLi9pbmRpY2F0b3JzL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL2luZGljYXRvcnMvU2VsZWN0UmVjdCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuL1N1cmZhY2UnO1xuaW1wb3J0IEhvdEtleVByb3ZpZGVyIGZyb20gJy4vSG90S2V5UHJvdmlkZXInO1xuaW1wb3J0IFNWR1Jvb3QgZnJvbSAnLi9TVkdSb290JztcbmltcG9ydCB7IGdldEJCb3ggfSBmcm9tICcuL0NvbW1vbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogNDAwLFxuICAgIGhlaWdodDogNDAwLFxuICAgIG9iamVjdHM6IFtdLFxuICAgIG9iamVjdFR5cGVzOiB7fSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgfVxuXG4gIG9uTW91c2VPdmVyID0gKGluZGV4KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IHRydWUsIGN1cnJlbnRseUhvdmVyaW5nOiBpbmRleCB9KTtcbiAgfVxuXG4gIG9uTW91c2VMZWF2ZSA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiBmYWxzZSB9KVxuXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRleGVzID0+IHtcbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBuZXcgU2V0KGluZGV4ZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvbiB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5jb21wdXRlU2VsZWN0aW9uKGluZGV4KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb25cbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBub2RlUmVmPXt0aGlzLm9iamVjdFJlZnNbaW5kZXhdfVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5vbk1vdXNlT3ZlcihpbmRleCl9XG4gICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm9uTW91c2VEb3duKGluZGV4LCBldmVudCl9XG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5vbk1vdXNlTGVhdmV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBtdWx0aVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXG4gICAgICBvYmplY3RzLmRlbGV0ZShpbmRleCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBhZGQgdG8gc2VsZWN0aW9uXG4gICAgICAvLyBwb3NzaWJseSwgZGlzc2Fsb3cgc2VsZWN0aW5nIGFub3RoZXIgdHlwZVxuICAgICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBzYW1lVHlwZSA9IHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICAgIHJldHVybiBzYW1lVHlwZSA/IG9iamVjdHMuYWRkKGluZGV4KSA6IG9iamVjdHM7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyBkZXNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlU2VsZWN0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKG11bHRpU2VsZWN0ICYmIHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmdsZVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdEFsbCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHsgd2lkdGgsIGhlaWdodCB9O1xuICAgIGNvbnN0IHsgY3VycmVudGx5SG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZE9iamVjdHNBcnJheSA9IFsuLi5zZWxlY3RlZE9iamVjdHNdOyAvLyBDb252ZXJ0IFNldCB0byBBcnJheVxuICAgIGNvbnN0IHJlbmRlckhvdmVyID0gdGhpcy5zaG91bGRSZW5kZXJIb3ZlcihjdXJyZW50bHlIb3ZlcmluZyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleVByb3ZpZGVyIHsuLi5kaW1lbnNpb25zfVxuICAgICAgICBzZXRNdWx0aVNlbGVjdD17bXVsdGlTZWxlY3QgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0IH0pfVxuICAgICAgPlxuICAgICAgICA8U1ZHUm9vdCB7Li4uZGltZW5zaW9uc30gc2VsZWN0YWJsZXM9e3RoaXMub2JqZWN0UmVmc30+XG4gICAgICAgICAgPFN1cmZhY2UgZGVzZWxlY3RBbGw9e3RoaXMuZGVzZWxlY3RBbGx9Lz5cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgKFxuICAgICAgICAgICAgPEhvdmVyUmVjdFxuICAgICAgICAgICAgICB7Li4uZ2V0QkJveCh0aGlzLm9iamVjdFJlZnNbY3VycmVudGx5SG92ZXJpbmddKX1cbiAgICAgICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLm9uTW91c2VMZWF2ZX0gIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4uZ2V0QkJveCh0aGlzLm9iamVjdFJlZnNbb2JqZWN0SW5kZXhdKX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24ob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU1ZHUm9vdD5cbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG4iXX0=