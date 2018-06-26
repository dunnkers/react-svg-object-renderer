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

    _defineProperty(this, "onMouseDown", (index, event) => {
      event.preventDefault(); // 💡 Prevents user selecting any svg text

      this.setState({
        selectedObjects: this.computeSelection(index)
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(this.state.selectedObjects));
    });

    _defineProperty(this, "getBBox", index => {
      // destruct and construct;  getBBox returns a SVGRect which does not spread.
      const {
        x,
        y,
        width,
        height
      } = this.objectRefs[index].getBBox();
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
        refCallback: ref => {
          this.objectRefs[index] = ref;
        } // 💡 We should use `createRef` from React ^v16.x onwards instead.
        ,
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
        dragging: true,
        dragOrigin: this.computeCoordinates(event)
      });
    });

    _defineProperty(this, "handleDrag", event => {
      if (this.state.dragging) {
        const {
          dragOrigin
        } = this.state;
        const current = this.computeCoordinates(event);
        this.setState({
          dragRect: {
            x: Math.min(current.x, dragOrigin.x),
            y: Math.min(current.y, dragOrigin.y),
            width: Math.abs(current.x - dragOrigin.x),
            height: Math.abs(current.y - dragOrigin.y)
          }
        });
      }
    });

    _defineProperty(this, "stopDrag", event => {
      this.setState({
        dragging: false,
        dragRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      });
    });

    this.objectRefs = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwib2JqZWN0UmVmcyIsImdldEJCb3giLCJtdWx0aVNlbGVjdE9uIiwibXVsdGlTZWxlY3RPZmYiLCJzZXF1ZW5jZSIsImFjdGlvbiIsIm9iamVjdHMiLCJ0eXBlIiwibXVsdGlwbGVUeXBlU2VsZWN0aW9uIiwiaGFzIiwic2l6ZSIsImlzU2VsZWN0ZWRUeXBlIiwib2JqZWN0Iiwib2JqZWN0VHlwZXMiLCJPYmplY3RDb21wb25lbnQiLCJyZWYiLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VEb3duIiwib25Nb3VzZUxlYXZlIiwic3Ryb2tlIiwiZmlsbCIsInN0cm9rZVdpZHRoIiwiY29tcHV0ZUNvb3JkaW5hdGVzIiwiY3VycmVudCIsIk1hdGgiLCJtaW4iLCJhYnMiLCJzdmdSZWYiLCJkZWxldGUiLCJzYW1lVHlwZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJsZWZ0IiwiY2xpZW50WSIsInRvcCIsInJlbmRlciIsInNlbGVjdGVkT2JqZWN0c0FycmF5IiwicmVuZGVySG92ZXIiLCJzaG91bGRSZW5kZXJIb3ZlciIsImhvdEtleVN0eWxlIiwib3V0bGluZSIsIm1hcCIsImhhbmRsZXJzIiwid2luZG93IiwiZXZ0Iiwic3R5bGVzIiwic3RhcnREcmFnIiwiaGFuZGxlRHJhZyIsInN0b3BEcmFnIiwicmVuZGVyU3VyZmFjZSIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwicmVuZGVyRHJhZ1JlY3QiLCJudW1iZXIiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0T2YiLCJmdW5jIiwiYm9vbCIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRTaXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsRUFBMkJDLFNBQTNCLFFBQTRDLE9BQTVDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsZUFBeEI7QUFFQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUVBLGVBQWUsTUFBTUMsaUJBQU4sU0FBZ0NOLFNBQWhDLENBQTBDO0FBZ0N2RE8sY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOOztBQURpQixtQ0FYWDtBQUNOQyxrQkFBWSxLQUROO0FBRU5DLHlCQUFtQixJQUZiO0FBR05DLHVCQUFpQixJQUFJQyxHQUFKLEVBSFg7QUFJTkMsbUJBQWEsS0FKUDtBQUtOQyxvQkFBYyxJQUxSO0FBTU5DLGdCQUFVLEtBTko7QUFPTkMsa0JBQVk7QUFBRUMsV0FBRyxDQUFMO0FBQVFDLFdBQUc7QUFBWCxPQVBOO0FBUU5DLGdCQUFVO0FBQUVGLFdBQUcsQ0FBTDtBQUFRQyxXQUFHLENBQVg7QUFBY0UsZUFBTyxDQUFyQjtBQUF3QkMsZ0JBQVE7QUFBaEM7QUFSSixLQVdXOztBQUFBLHlDQU1KQyxLQUFELElBQVc7QUFDdkIsV0FBS0MsUUFBTCxD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WjtBQVFqQnhELHlCQUF1QnJDLFVBQVU4RjtBQVJoQixDOztnQkFEQTFGLGlCLGtCQVlHO0FBQ3BCYyxTQUFPLEdBRGE7QUFFcEJDLFVBQVEsR0FGWTtBQUdwQmdCLFdBQVMsRUFIVztBQUlwQk8sZUFBYSxFQUpPO0FBS3BCakIscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCWSx5QkFBdUI7QUFOSCxDOztBQXVReEIsT0FBTyxNQUFNMEMsU0FBUztBQUNwQmdCLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgSG90S2V5cyB9IGZyb20gJ3JlYWN0LWhvdGtleXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vSG92ZXJSZWN0JztcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vU2VsZWN0UmVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogNDAwLFxuICAgIGhlaWdodDogNDAwLFxuICAgIG9iamVjdHM6IFtdLFxuICAgIG9iamVjdFR5cGVzOiB7fSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbCxcbiAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgZHJhZ09yaWdpbjogeyB4OiAwLCB5OiAwIH0sXG4gICAgZHJhZ1JlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9iamVjdFJlZnMgPSB7fTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgb25Nb3VzZURvd24gPSAoaW5kZXgsIGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8g8J+SoSBQcmV2ZW50cyB1c2VyIHNlbGVjdGluZyBhbnkgc3ZnIHRleHRcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpXG4gICAgfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gIH1cblxuICAvKiDimqBcbiAgICAqIGdldEJCb3goKSBtaWdodCBoYXZlIGluc3VmZmljaWVudCBicm93c2VyIHN1cHBvcnQhXG4gICAgKiBUaGUgZnVuY3Rpb24gaGFzIGxpdHRsZSBkb2N1bWVudGF0aW9uLiBJbiBjYXNlIHVzZSBvZiBCQm94IHR1cm5zIG91dFxuICAgICogcHJvYmxlbWF0aWMsIGNvbnNpZGVyIHVzaW5nIGB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClgIGFsb25nIHdpdGhcbiAgICAqICQoJzxzdmc+JykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgdG8gY29ycmVjdCB0aGUgeCBhbmQgeSBvZmZzZXQuXG4gICAgKi9cbiAgZ2V0QkJveCA9IChpbmRleCkgPT4ge1xuICAgIC8vIGRlc3RydWN0IGFuZCBjb25zdHJ1Y3Q7ICBnZXRCQm94IHJldHVybnMgYSBTVkdSZWN0IHdoaWNoIGRvZXMgbm90IHNwcmVhZC5cbiAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMub2JqZWN0UmVmc1tpbmRleF0uZ2V0QkJveCgpO1xuICAgIHJldHVybiB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIGhhbmRsZXJzID0ge1xuICAgIG11bHRpU2VsZWN0T246ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogdHJ1ZSB9KSxcbiAgICBtdWx0aVNlbGVjdE9mZjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiBmYWxzZSB9KVxuICB9O1xuXG4gIG1hcCA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleWRvd24nIH0sXG4gICAgbXVsdGlTZWxlY3RPZmY6IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5dXAnIH1cbiAgfTtcblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlclN1cmZhY2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIG9wYWNpdHk9XCIwLjBcIlxuICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICBoZWlnaHQ9XCIxMDAlXCJcbiAgICAgICAgb25Nb3VzZURvd249eyhldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyT2JqZWN0ID0gKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IE9iamVjdENvbXBvbmVudCA9IG9iamVjdFR5cGVzW29iamVjdC50eXBlXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8T2JqZWN0Q29tcG9uZW50XG4gICAgICAgIHsuLi5vYmplY3R9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIHJlZkNhbGxiYWNrPXtyZWYgPT4ge1xuICAgICAgICAgIHRoaXMub2JqZWN0UmVmc1tpbmRleF0gPSByZWY7XG4gICAgICAgIH19IC8vIPCfkqEgV2Ugc2hvdWxkIHVzZSBgY3JlYXRlUmVmYCBmcm9tIFJlYWN0IF52MTYueCBvbndhcmRzIGluc3RlYWQuXG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLm9uTW91c2VPdmVyKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMub25Nb3VzZURvd24oaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRyYWdSZWN0ID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB7Li4udGhpcy5zdGF0ZS5kcmFnUmVjdH1cbiAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHN0cm9rZTogJyM0Mjg1ZjQnLFxuICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICBzdHJva2VXaWR0aDogJzJweCdcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIGFkZCB0byBzZWxlY3Rpb25cbiAgICAgIC8vIHBvc3NpYmx5LCBkaXNzYWxvdyBzZWxlY3RpbmcgYW5vdGhlciB0eXBlXG4gICAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNhbWVUeXBlID0gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgICAgcmV0dXJuIHNhbWVUeXBlID8gb2JqZWN0cy5hZGQoaW5kZXgpIDogb2JqZWN0cztcbiAgICB9XG4gIH1cblxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0RHJhZyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IHRydWUsXG4gICAgICBkcmFnT3JpZ2luOiB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudClcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZURyYWcgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kcmFnZ2luZykge1xuICAgICAgY29uc3QgeyBkcmFnT3JpZ2luIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnUmVjdDoge1xuICAgICAgICAgIHg6IE1hdGgubWluKGN1cnJlbnQueCwgZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnksIGRyYWdPcmlnaW4ueSksXG4gICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnQueCAtIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhjdXJyZW50LnkgLSBkcmFnT3JpZ2luLnkpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXB1dGVDb29yZGluYXRlcyhtb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgZGltID0gdGhpcy5zdmdSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LmNsaWVudFggLSBkaW0ubGVmdCxcbiAgICAgIHk6IG1vdXNlRXZlbnQuY2xpZW50WSAtIGRpbS50b3BcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgY3VycmVudGx5SG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgZHJhZ2dpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuICAgIGNvbnN0IGhvdEtleVN0eWxlID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBvdXRsaW5lOiAwXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5c1xuICAgICAgICBzdHlsZT17aG90S2V5U3R5bGV9XG4gICAgICAgIGtleU1hcD17dGhpcy5tYXB9XG4gICAgICAgIGhhbmRsZXJzPXt0aGlzLmhhbmRsZXJzfVxuICAgICAgICBmb2N1c2VkXG4gICAgICAgIGF0dGFjaD17d2luZG93fVxuICAgICAgICBvbk1vdXNlRG93bj17KGV2dCkgPT4gZXZ0LnByZXZlbnREZWZhdWx0KCl9XG4gICAgICA+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICByZWY9e3RoaXMuc3ZnUmVmfVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzdHlsZT17c3R5bGVzfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnN0YXJ0RHJhZ31cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5oYW5kbGVEcmFnfVxuICAgICAgICAgIG9uTW91c2VVcD17dGhpcy5zdG9wRHJhZ31cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclN1cmZhY2UoKX1cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgIWRyYWdnaW5nICYmIChcbiAgICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChjdXJyZW50bHlIb3ZlcmluZyl9XG4gICAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5vbk1vdXNlTGVhdmV9ICBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtzZWxlY3RlZE9iamVjdHNBcnJheS5tYXAoKG9iamVjdEluZGV4LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChvYmplY3RJbmRleCl9XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKG9iamVjdEluZGV4LCBldmVudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuXG4gICAgICAgICAge2RyYWdnaW5nICYmIHRoaXMucmVuZGVyRHJhZ1JlY3QoKX1cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L0hvdEtleXM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NSdcbiAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICsgJ2lOR04wWTNSamNpUGp3dmNtVmpkRDRLUEhKbFkzUWdlRDBpTVRBaUlIazlJakV3SWlCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJRydcbiAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG59O1xuIl19