function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import HoverRect from './indicators/HoverRect';
import SelectRect from './indicators/SelectRect';
import Surface from './Surface';
import HotKeyProvider from './HotKeyProvider';
import SVGRoot from './SVGRoot';
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

    _defineProperty(this, "getBBox", index => {
      // destruct and construct;  getBBox returns a SVGRect which does not spread.
      const {
        x,
        y,
        width,
        height
      } = this.objectRefs[index].current.getBBox();
      return {
        x,
        y,
        width,
        height
      };
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
    const {
      currentlyHovering,
      selectedObjects
    } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    const renderHover = this.shouldRenderHover(currentlyHovering);
    return React.createElement(HotKeyProvider, {
      width: width,
      setMultiSelect: multiSelect => this.setState({
        multiSelect
      })
    }, React.createElement(SVGRoot, {
      width: width,
      height: height
    }, React.createElement(Surface, {
      deselectAll: () => {
        if (this.state.selectedObjects.size > 0) {
          this.setState({
            selectedObjects: new Set()
          }); // ⚡ notify outside world of selection change. convert set to array.

          this.props.onSelectionChange(Array.from(this.state.selectedObjects));
        }
      }
    }), objects.map(this.renderObject), renderHover && React.createElement(HoverRect, _extends({}, this.getBBox(currentlyHovering), {
      stopHover: this.onMouseLeave
    })), selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, this.getBBox(objectIndex), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsIlNWR09iamVjdFJlbmRlcmVyIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzSG92ZXJpbmciLCJjdXJyZW50bHlIb3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGV4ZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIm9iamVjdFJlZnMiLCJjdXJyZW50IiwiZ2V0QkJveCIsIm9iamVjdHMiLCJ0eXBlIiwic3RhdGUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJzaXplIiwiaXNTZWxlY3RlZFR5cGUiLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsIm9uTW91c2VPdmVyIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTGVhdmUiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwiZGVsZXRlIiwic2FtZVR5cGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJjbGVhciIsInJlbmRlciIsInNlbGVjdGVkT2JqZWN0c0FycmF5IiwicmVuZGVySG92ZXIiLCJzaG91bGRSZW5kZXJIb3ZlciIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiXSwibWFwcGlu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QWEsRUFKTztBQUtwQnJCLHFCQUFtQixNQUFNLENBQUUsQ0FMUDtBQU1wQmdCLHlCQUF1QjtBQU5ILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9Ib3ZlclJlY3QnO1xuaW1wb3J0IFNlbGVjdFJlY3QgZnJvbSAnLi9pbmRpY2F0b3JzL1NlbGVjdFJlY3QnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9TdXJmYWNlJztcbmltcG9ydCBIb3RLZXlQcm92aWRlciBmcm9tICcuL0hvdEtleVByb3ZpZGVyJztcbmltcG9ydCBTVkdSb290IGZyb20gJy4vU1ZHUm9vdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogNDAwLFxuICAgIGhlaWdodDogNDAwLFxuICAgIG9iamVjdHM6IFtdLFxuICAgIG9iamVjdFR5cGVzOiB7fSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgfVxuXG4gIG9uTW91c2VPdmVyID0gKGluZGV4KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IHRydWUsIGN1cnJlbnRseUhvdmVyaW5nOiBpbmRleCB9KTtcbiAgfVxuXG4gIG9uTW91c2VMZWF2ZSA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiBmYWxzZSB9KVxuXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRleGVzID0+IHtcbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBuZXcgU2V0KGluZGV4ZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvbiB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5jb21wdXRlU2VsZWN0aW9uKGluZGV4KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb25cbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICAvKiDimqBcbiAgICAqIGdldEJCb3goKSBtaWdodCBoYXZlIGluc3VmZmljaWVudCBicm93c2VyIHN1cHBvcnQhXG4gICAgKiBUaGUgZnVuY3Rpb24gaGFzIGxpdHRsZSBkb2N1bWVudGF0aW9uLiBJbiBjYXNlIHVzZSBvZiBCQm94IHR1cm5zIG91dFxuICAgICogcHJvYmxlbWF0aWMsIGNvbnNpZGVyIHVzaW5nIGB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClgIGFsb25nIHdpdGhcbiAgICAqICQoJzxzdmc+JykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgdG8gY29ycmVjdCB0aGUgeCBhbmQgeSBvZmZzZXQuXG4gICAgKi9cbiAgZ2V0QkJveCA9IChpbmRleCkgPT4ge1xuICAgIC8vIGRlc3RydWN0IGFuZCBjb25zdHJ1Y3Q7ICBnZXRCQm94IHJldHVybnMgYSBTVkdSZWN0IHdoaWNoIGRvZXMgbm90IHNwcmVhZC5cbiAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMub2JqZWN0UmVmc1tpbmRleF0uY3VycmVudC5nZXRCQm94KCk7XG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgaXNTZWxlY3RlZFR5cGUgPSAoaW5kZXgpID0+XG4gICAgdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkVHlwZTtcblxuICBzaG91bGRSZW5kZXJIb3ZlciA9IChpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgaXNIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKCFpc0hvdmVyaW5nIHx8IHNlbGVjdGVkT2JqZWN0cy5oYXMoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlQcm92aWRlciB3aWR0aD17d2lkdGh9XG4gICAgICAgIHNldE11bHRpU2VsZWN0PXttdWx0aVNlbGVjdCA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3QgfSl9XG4gICAgICA+XG4gICAgICAgIDxTVkdSb290IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KClcbiAgICAgICAgICAgICAgfSk7XG4gIFxuICAgICAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19Lz5cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgKFxuICAgICAgICAgICAgPEhvdmVyUmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KGN1cnJlbnRseUhvdmVyaW5nKX1cbiAgICAgICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLm9uTW91c2VMZWF2ZX0gIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KG9iamVjdEluZGV4KX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24ob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU1ZHUm9vdD5cbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG4iXX0=