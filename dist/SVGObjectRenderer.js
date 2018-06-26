function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import HoverRect from './HoverRect';
import SelectRect from './SelectRect';
export default class SVGObjectRenderer extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      isHovering: false,
      currentlyHovering: null,
      selectedObjects: new Set(),
      multiSelect: false,
      selectedType: null,
      dragging: false,
      dragOrigin: {
        x: 0,
        y: 0
      },
      dragRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
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

    _defineProperty(this, "handlers", {
      multiSelectOn: () => this.setState({
        multiSelect: true
      }),
      multiSelectOff: () => this.setState({
        multiSelect: false
      })
    });

    _defineProperty(this, "map", {
      multiSelectOn: {
        sequence: 'ctrl',
        action: 'keydown'
      },
      multiSelectOff: {
        sequence: 'ctrl',
        action: 'keyup'
      }
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

    _defineProperty(this, "renderSurface", () => {
      return React.createElement("rect", {
        opacity: "0.0",
        width: "100%",
        height: "100%",
        onMouseDown: event => {
          event.preventDefault();

          if (this.state.selectedObjects.size === 0) {
            return;
          }

          this.setState({
            selectedObjects: new Set()
          }); // ⚡ notify outside world of selection change. convert set to array.

          this.props.onSelectionChange(Array.from(this.state.selectedObjects));
        }
      });
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

    _defineProperty(this, "renderDragRect", () => {
      return React.createElement("rect", _extends({}, this.state.dragRect, {
        fill: "none",
        style: {
          stroke: '#4285f4',
          fill: 'none',
          strokeWidth: '2px'
        }
      }));
    });

    _defineProperty(this, "startDrag", event => {
      this.setState({
        dragInitiated: true,
        dragOrigin: this.computeCoordinates(event)
      });
    });

    _defineProperty(this, "handleDrag", event => {
      const {
        dragInitiated,
        dragOrigin
      } = this.state;
      let {
        dragging
      } = this.state;

      if (dragInitiated && !dragging) {
        dragging = true;
      }

      if (dragging) {
        const current = this.computeCoordinates(event);
        this.setState({
          dragging: true,
          dragRect: {
            x: Math.min(current.x, dragOrigin.x),
            y: Math.min(current.y, dragOrigin.y),
            width: Math.abs(current.x - dragOrigin.x),
            height: Math.abs(current.y - dragOrigin.y)
          }
        });
      }
    });

    _defineProperty(this, "rectToBox", rect => {
      return {
        left: rect.x,
        right: rect.x + rect.width,
        top: rect.y,
        bottom: rect.y + rect.height
      };
    });

    _defineProperty(this, "stopDrag", event => {
      if (this.state.dragging) {
        const indices = this.props.objects.map((object, index) => index);
        const toSelect = indices.filter(index => {
          return this.boxOverlap(this.rectToBox(this.state.dragRect), this.rectToBox(this.getBBox(index)));
        });
        this.selectObjects(toSelect);
      }

      this.setState({
        dragging: false,
        dragInitiated: false,
        dragRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      });
    });

    this.objectRefs = Object.entries(props.objects).map(() => createRef());
    this.svgRef = createRef();
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

  overlaps(a, b, x, y) {
    return Math.max(a, x) < Math.min(b, y);
  }

  boxOverlap(a, b) {
    return this.overlaps(a.left, a.right, b.left, b.right) && this.overlaps(a.top, a.bottom, b.top, b.bottom);
  }

  computeCoordinates(mouseEvent) {
    const dim = this.svgRef.current.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - dim.left,
      y: mouseEvent.clientY - dim.top
    };
  }

  render() {
    const {
      width,
      height,
      objects
    } = this.props;
    const {
      currentlyHovering,
      selectedObjects,
      dragging
    } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    const renderHover = this.shouldRenderHover(currentlyHovering);
    const hotKeyStyle = {
      width,
      outline: 0
    };
    return React.createElement(HotKeys, {
      style: hotKeyStyle,
      keyMap: this.map,
      handlers: this.handlers,
      focused: true,
      attach: window,
      onMouseDown: evt => evt.preventDefault()
    }, React.createElement("svg", {
      ref: this.svgRef,
      width: width,
      height: height,
      style: styles,
      onMouseDown: this.startDrag,
      onMouseMove: this.handleDrag,
      onMouseUp: this.stopDrag
    }, this.renderSurface(), objects.map(this.renderObject), renderHover && !dragging && React.createElement(HoverRect, _extends({}, this.getBBox(currentlyHovering), {
      stopHover: this.onMouseLeave
    })), selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, this.getBBox(objectIndex), {
      key: index,
      select: event => this.onMouseDown(objectIndex, event)
    }))), dragging && this.renderDragRect()));
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

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsInNldFN0YXRlIiwiaW5kZXhlcyIsIm5ld1NlbGVjdGlvbiIsIm9uU2VsZWN0aW9uQ2hhbmdlIiwiQXJyYXkiLCJmcm9tIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvYmplY3RSZWZzIiwiY3VycmVudCIsImdldEJCb3giLCJtdWx0aVNlbGVjdE9uIiwibXVsdGlTZWxlY3RPZmYiLCJzZXF1ZW5jZSIsImFjdGlvbiIsIm9iamVjdHMiLCJ0eXBlIiwic3RhdGUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJzaXplIiwiaXNTZWxlY3RlZFR5cGUiLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsIm9uTW91c2VPdmVyIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTGVhdmUiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJkcmFnSW5pdGlhdGVkIiwiY29tcHV0ZUNvb3JkaW5hdGVzIiwiTWF0aCIsIm1pbiIsImFicyIsInJlY3QiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJpbmRpY2VzIiwibWFwIiwidG9TZWxlY3QiLCJmaWx0ZXIiLCJib3hPdmVybGFwIiwicmVjdFRvQm94Iiwic2VsZWN0T2JqZWN0cyIsIk9iamVjdCIsImVudHJpZXMiLCJzdmdSZWYiLCJkZWxldGUiLCJzYW1lVHlwZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwib3ZlcmxhcHMiLCJhIiwiYiIsIm1heCIsIm1vdXNlRXZlbnQiLCJkaW0iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsInJlbmRlciIsInNlbGVjdGVkT2JqZWN0c0FycmF5IiwicmVuZGVySG92ZXIiLCJzaG91bGRSZW5kZXJIb3ZlciIsImhvdEtleVN0eWxlIiwib3V0bGluZSIsImhhbmRsZXJzIiwid2luZG93IiwiZXZ0Iiwic3R5bGVzIiwic3RhcnREcmFnIiwiaGFuZGxlRHJhZyIsInN0b3BEcmFnIiwicmVuZGVyU3VyZmFjZSIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwicmVuZGVyRHJhZ1JlY3QiLCJudW1iZXIiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0T2YiLCJmdW5jIiwiYm9vbCIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRTaXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsRUFBMkJDLFNBQTNCLFFBQTRDLE9BQTVDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsZUFBeEI7QUFFQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUVBLGVBQWUsTUFBTUMsaUJBQU4sU0FBZ0NOLFNBQWhDLENBQTBDO0FBZ0N2RE8sY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOOztBQURpQixtQ0FYWDtBQUNOQyxrQkFBWSxLQUROO0FBRU5DLHlCQUFtQixJQUZiO0FBR05DLHVCQUFpQixJQUFJQyxHQUFKLEVBSFg7QUFJTkMsbUJBQWEsS0FKUDtBQUtOQyxvQkFBYyxJQUxSO0FBTU5DLGdCQUFVLEtBTko7QUFPTkMs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QkFBdUI7QUFOSCxDOztBQXdUeEIsT0FBTyxNQUFNd0QsU0FBUztBQUNwQmdCLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgSG90S2V5cyB9IGZyb20gJ3JlYWN0LWhvdGtleXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vSG92ZXJSZWN0JztcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vU2VsZWN0UmVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogNDAwLFxuICAgIGhlaWdodDogNDAwLFxuICAgIG9iamVjdHM6IFtdLFxuICAgIG9iamVjdFR5cGVzOiB7fSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbCxcbiAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgZHJhZ09yaWdpbjogeyB4OiAwLCB5OiAwIH0sXG4gICAgZHJhZ1JlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9iamVjdFJlZnMgPSBPYmplY3QuZW50cmllcyhwcm9wcy5vYmplY3RzKS5tYXAoKCkgPT4gY3JlYXRlUmVmKCkpO1xuICAgIHRoaXMuc3ZnUmVmID0gY3JlYXRlUmVmKCk7XG4gIH1cblxuICBvbk1vdXNlT3ZlciA9IChpbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiB0cnVlLCBjdXJyZW50bHlIb3ZlcmluZzogaW5kZXggfSk7XG4gIH1cblxuICBvbk1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogZmFsc2UgfSlcblxuICBzZWxlY3RPYmplY3RzID0gaW5kZXhlcyA9PiB7XG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gbmV3IFNldChpbmRleGVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb24gfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xuICB9XG5cbiAgb25Nb3VzZURvd24gPSAoaW5kZXgsIGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8g8J+SoSBQcmV2ZW50cyB1c2VyIHNlbGVjdGluZyBhbnkgc3ZnIHRleHRcblxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uXG4gICAgfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xuICB9XG5cbiAgLyog4pqgXG4gICAgKiBnZXRCQm94KCkgbWlnaHQgaGF2ZSBpbnN1ZmZpY2llbnQgYnJvd3NlciBzdXBwb3J0IVxuICAgICogVGhlIGZ1bmN0aW9uIGhhcyBsaXR0bGUgZG9jdW1lbnRhdGlvbi4gSW4gY2FzZSB1c2Ugb2YgQkJveCB0dXJucyBvdXRcbiAgICAqIHByb2JsZW1hdGljLCBjb25zaWRlciB1c2luZyBgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBhbG9uZyB3aXRoXG4gICAgKiAkKCc8c3ZnPicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHRvIGNvcnJlY3QgdGhlIHggYW5kIHkgb2Zmc2V0LlxuICAgICovXG4gIGdldEJCb3ggPSAoaW5kZXgpID0+IHtcbiAgICAvLyBkZXN0cnVjdCBhbmQgY29uc3RydWN0OyAgZ2V0QkJveCByZXR1cm5zIGEgU1ZHUmVjdCB3aGljaCBkb2VzIG5vdCBzcHJlYWQuXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLm9iamVjdFJlZnNbaW5kZXhdLmN1cnJlbnQuZ2V0QkJveCgpO1xuICAgIHJldHVybiB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIGhhbmRsZXJzID0ge1xuICAgIG11bHRpU2VsZWN0T246ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogdHJ1ZSB9KSxcbiAgICBtdWx0aVNlbGVjdE9mZjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiBmYWxzZSB9KVxuICB9O1xuXG4gIG1hcCA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleWRvd24nIH0sXG4gICAgbXVsdGlTZWxlY3RPZmY6IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5dXAnIH1cbiAgfTtcblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlclN1cmZhY2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIG9wYWNpdHk9XCIwLjBcIlxuICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICBoZWlnaHQ9XCIxMDAlXCJcbiAgICAgICAgb25Nb3VzZURvd249eyhldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRHJhZ1JlY3QgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIHsuLi50aGlzLnN0YXRlLmRyYWdSZWN0fVxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgc3Ryb2tlOiAnIzQyODVmNCcsXG4gICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgIHN0cm9rZVdpZHRoOiAnMnB4J1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnREcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnSW5pdGlhdGVkOiB0cnVlLFxuICAgICAgZHJhZ09yaWdpbjogdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBkcmFnSW5pdGlhdGVkLCBkcmFnT3JpZ2luIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCB7IGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGRyYWdJbml0aWF0ZWQgJiYgIWRyYWdnaW5nKSB7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnaW5nOiB0cnVlLFxuICAgICAgICBkcmFnUmVjdDoge1xuICAgICAgICAgIHg6IE1hdGgubWluKGN1cnJlbnQueCwgZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnksIGRyYWdPcmlnaW4ueSksXG4gICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnQueCAtIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhjdXJyZW50LnkgLSBkcmFnT3JpZ2luLnkpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJsYXBzKGEsIGIsIHgsIHkpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgeCkgPCBNYXRoLm1pbihiLCB5KTtcbiAgfVxuXG4gIGJveE92ZXJsYXAoYSwgYikge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXBzKGEubGVmdCwgYS5yaWdodCwgYi5sZWZ0LCBiLnJpZ2h0KSAmJiBcbiAgICAgICAgICAgdGhpcy5vdmVybGFwcyhhLnRvcCwgYS5ib3R0b20sIGIudG9wLCBiLmJvdHRvbSlcbiAgfVxuXG4gIHJlY3RUb0JveCA9IChyZWN0KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QueCxcbiAgICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgICAgdG9wOiByZWN0LnksXG4gICAgICBib3R0b206IHJlY3QueSArIHJlY3QuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHN0b3BEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLnByb3BzLm9iamVjdHMubWFwKChvYmplY3QsIGluZGV4KSA9PiBpbmRleCk7XG4gICAgICBjb25zdCB0b1NlbGVjdCA9IGluZGljZXMuZmlsdGVyKGluZGV4ID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm94T3ZlcmxhcChcbiAgICAgICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLnN0YXRlLmRyYWdSZWN0KSxcbiAgICAgICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLmdldEJCb3goaW5kZXgpKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNlbGVjdE9iamVjdHModG9TZWxlY3QpO1xuICAgIH0gXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWdJbml0aWF0ZWQ6IGZhbHNlLFxuICAgICAgZHJhZ1JlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wdXRlQ29vcmRpbmF0ZXMobW91c2VFdmVudCkge1xuICAgIGNvbnN0IGRpbSA9IHRoaXMuc3ZnUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogbW91c2VFdmVudC5jbGllbnRYIC0gZGltLmxlZnQsXG4gICAgICB5OiBtb3VzZUV2ZW50LmNsaWVudFkgLSBkaW0udG9wXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XG4gICAgY29uc3QgcmVuZGVySG92ZXIgPSB0aGlzLnNob3VsZFJlbmRlckhvdmVyKGN1cnJlbnRseUhvdmVyaW5nKTtcbiAgICBjb25zdCBob3RLZXlTdHlsZSA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgb3V0bGluZTogMFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleXNcbiAgICAgICAgc3R5bGU9e2hvdEtleVN0eWxlfVxuICAgICAgICBrZXlNYXA9e3RoaXMubWFwfVxuICAgICAgICBoYW5kbGVycz17dGhpcy5oYW5kbGVyc31cbiAgICAgICAgZm9jdXNlZFxuICAgICAgICBhdHRhY2g9e3dpbmRvd31cbiAgICAgICAgb25Nb3VzZURvd249eyhldnQpID0+IGV2dC5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgcmVmPXt0aGlzLnN2Z1JlZn1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlc31cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zdGFydERyYWd9XG4gICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuaGFuZGxlRHJhZ31cbiAgICAgICAgICBvbk1vdXNlVXA9e3RoaXMuc3RvcERyYWd9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTdXJmYWNlKCl9XG5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3JlbmRlckhvdmVyICYmICFkcmFnZ2luZyAmJiAoXG4gICAgICAgICAgICA8SG92ZXJSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3goY3VycmVudGx5SG92ZXJpbmcpfVxuICAgICAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMub25Nb3VzZUxlYXZlfSAgXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3gob2JqZWN0SW5kZXgpfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cblxuICAgICAgICAgIHtkcmFnZ2luZyAmJiB0aGlzLnJlbmRlckRyYWdSZWN0KCl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9Ib3RLZXlzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOiAndXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTUnXG4gICAgKyAndmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDBQU0l5TUNJK0NqeHlaV04wSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwJ1xuICAgICsgJ1BTSXlNQ0lnWm1sc2JEMGlJMlptWmlJK1BDOXlaV04wUGdvOGNtVmpkQ0IzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHWnBiR3c5SSdcbiAgICArICdpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BISmxZM1FnZUQwaU1UQWlJSGs5SWpFd0lpQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUcnXG4gICAgKyAnWnBiR3c5SWlOR04wWTNSamNpUGp3dmNtVmpkRDRLUEM5emRtYyspJyxcbiAgYmFja2dyb3VuZFNpemU6ICdhdXRvJ1xufTtcbiJdfQ==