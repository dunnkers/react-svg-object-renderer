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
      this.state.selectedObjects.clear();
      this.setState({
        selectedObjects: new Set(indexes)
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(this.state.selectedObjects));
    });

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

    _defineProperty(this, "rectToBox", rect => {
      return {
        left: rect.x,
        right: rect.x + rect.width,
        top: rect.y,
        bottom: rect.y + rect.height
      };
    });

    _defineProperty(this, "stopDrag", event => {
      const {
        dragRect
      } = this.state;
      const indices = this.props.objects.map((object, index) => index);
      const toSelect = indices.filter(index => {
        return this.boxOverlap(this.rectToBox(dragRect), this.rectToBox(this.getBBox(index)));
      });
      this.selectObjects(toSelect);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsInNldFN0YXRlIiwiaW5kZXhlcyIsInN0YXRlIiwiY2xlYXIiLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0UmVmcyIsImN1cnJlbnQiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsImNvbXB1dGVDb29yZGluYXRlcyIsIk1hdGgiLCJtaW4iLCJhYnMiLCJyZWN0IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwiaW5kaWNlcyIsIm1hcCIsInRvU2VsZWN0IiwiZmlsdGVyIiwiYm94T3ZlcmxhcCIsInJlY3RUb0JveCIsInNlbGVjdE9iamVjdHMiLCJPYmplY3QiLCJlbnRyaWVzIiwic3ZnUmVmIiwiZGVsZXRlIiwic2FtZVR5cGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJvdmVybGFwcyIsImEiLCJiIiwibWF4IiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwicmVuZGVyIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJyZW5kZXJIb3ZlciIsInNob3VsZFJlbmRlckhvdmVyIiwiaG90S2V5U3R5bGUiLCJvdXRsaW5lIiwiaGFuZGxlcnMiLCJ3aW5kb3ciLCJldnQiLCJzdHlsZXMiLCJzdGFydERyYWciLCJoYW5kbGVEcmFnIiwic3RvcERyYWciLCJyZW5kZXJTdXJmYWNlIiwicmVuZGVyT2JqZWN0Iiwib2JqZWN0SW5kZXgiLCJyZW5kZXJEcmFnUmVjdCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RPZiIsImZ1bmMiLCJib29sIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixFQUEyQkMsU0FBM0IsUUFBNEMsT0FBNUM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsU0FBU0MsT0FBVCxRQUF3QixlQUF4QjtBQUVBLE9BQU9DLFNBQVAsTUFBc0IsYUFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBRUEsZUFBZSxNQUFNQyxpQkFBTixTQUFnQ04sU0FBaEMsQ0FBMEM7QUFnQ3ZETyxjQUFZQyxLQUFaLEVBQW1CO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLG1DQVhYO0FBQ05DLGtCQUFZLEtBRE47QUFFTkMseUJBQW1CLElBRmI7QUFHTkMsdUJBQWlCLElBQUlDLEdBQUosRUFIWDtBQUlOQyxtQkFBYSxLQUpQO0FBS05DLG9CQUFjLElBTFI7QUFNTkMsZ0JBQVUsS0FOSjtBQU9OQyxrQkFBWTtBQUFFQyxXQUFHLENBQUw7QUFBUUMsV0FB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Q0FBQ3FDLFdBQUQsRUFBY2hGLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNLEtBQUthLE9BQUwsQ0FBYW1FLFdBQWIsQ0FETjtBQUVFLFdBQUtoRixLQUZQO0FBR0UsY0FBU1EsS0FBRCxJQUFXLEtBQUtvQixXQUFMLENBQWlCb0QsV0FBakIsRUFBOEJ4RSxLQUE5QjtBQUhyQixPQURELENBcEJILEVBNEJHZixZQUFZLEtBQUt3RixjQUFMLEVBNUJmLENBUkYsQ0FERjtBQXlDRDs7QUFsVHNEOztnQkFBcENqRyxpQixlQUNBO0FBQ2pCYyxTQUFPbEIsVUFBVXNHLE1BREE7QUFFakJuRixVQUFRbkIsVUFBVXNHLE1BRkQ7QUFHakJoRSxXQUFTdEMsVUFBVXVHLE9BQVYsQ0FBa0J2RyxVQUFVd0csS0FBVixDQUFnQjtBQUN6Q2pFLFVBQU12QyxVQUFVeUcsTUFBVixDQUFpQkM7QUFEa0IsR0FBaEIsQ0FBbEIsQ0FIUTtBQU1qQjdELGVBQWE3QyxVQUFVMkcsUUFBVixDQUFtQjNHLFVBQVU0RyxJQUE3QixDQU5JO0FBT2pCbkYscUJBQW1CekIsVUFBVTRHLElBUFo7QUFRakJwRSx5QkFBdUJ4QyxVQUFVNkc7QUFSaEIsQzs7Z0JBREF6RyxpQixrQkFZRztBQUNwQmMsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJtQixXQUFTLEVBSFc7QUFJcEJPLGVBQWEsRUFKTztBQUtwQnBCLHFCQUFtQixNQUFNLENBQUUsQ0FMUDtBQU1wQmUseUJBQXVCO0FBTkgsQzs7QUF5U3hCLE9BQU8sTUFBTXNELFNBQVM7QUFDcEJnQixtQkFBaUIsc0VBQ2IsbUZBRGEsR0FFYixtRkFGYSxHQUdiLG1GQUhhLEdBSWIseUNBTGdCO0FBTXBCQyxrQkFBZ0I7QUFOSSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGwsXG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHsgeDogMCwgeTogMCB9LFxuICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgc2VsZWN0T2JqZWN0cyA9IGluZGV4ZXMgPT4ge1xuICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzLmNsZWFyKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0czogbmV3IFNldChpbmRleGVzKSB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMpKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGluZGV4LCBldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIPCfkqEgUHJldmVudHMgdXNlciBzZWxlY3RpbmcgYW55IHN2ZyB0ZXh0XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogdGhpcy5jb21wdXRlU2VsZWN0aW9uKGluZGV4KVxuICAgIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICB9XG5cbiAgLyog4pqgXG4gICAgKiBnZXRCQm94KCkgbWlnaHQgaGF2ZSBpbnN1ZmZpY2llbnQgYnJvd3NlciBzdXBwb3J0IVxuICAgICogVGhlIGZ1bmN0aW9uIGhhcyBsaXR0bGUgZG9jdW1lbnRhdGlvbi4gSW4gY2FzZSB1c2Ugb2YgQkJveCB0dXJucyBvdXRcbiAgICAqIHByb2JsZW1hdGljLCBjb25zaWRlciB1c2luZyBgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBhbG9uZyB3aXRoXG4gICAgKiAkKCc8c3ZnPicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHRvIGNvcnJlY3QgdGhlIHggYW5kIHkgb2Zmc2V0LlxuICAgICovXG4gIGdldEJCb3ggPSAoaW5kZXgpID0+IHtcbiAgICAvLyBkZXN0cnVjdCBhbmQgY29uc3RydWN0OyAgZ2V0QkJveCByZXR1cm5zIGEgU1ZHUmVjdCB3aGljaCBkb2VzIG5vdCBzcHJlYWQuXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLm9iamVjdFJlZnNbaW5kZXhdLmN1cnJlbnQuZ2V0QkJveCgpO1xuICAgIHJldHVybiB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIGhhbmRsZXJzID0ge1xuICAgIG11bHRpU2VsZWN0T246ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogdHJ1ZSB9KSxcbiAgICBtdWx0aVNlbGVjdE9mZjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiBmYWxzZSB9KVxuICB9O1xuXG4gIG1hcCA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleWRvd24nIH0sXG4gICAgbXVsdGlTZWxlY3RPZmY6IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5dXAnIH1cbiAgfTtcblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlclN1cmZhY2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIG9wYWNpdHk9XCIwLjBcIlxuICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICBoZWlnaHQ9XCIxMDAlXCJcbiAgICAgICAgb25Nb3VzZURvd249eyhldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyT2JqZWN0ID0gKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IE9iamVjdENvbXBvbmVudCA9IG9iamVjdFR5cGVzW29iamVjdC50eXBlXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8T2JqZWN0Q29tcG9uZW50XG4gICAgICAgIHsuLi5vYmplY3R9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIG5vZGVSZWY9e3RoaXMub2JqZWN0UmVmc1tpbmRleF19XG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLm9uTW91c2VPdmVyKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMub25Nb3VzZURvd24oaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRyYWdSZWN0ID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB7Li4udGhpcy5zdGF0ZS5kcmFnUmVjdH1cbiAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHN0cm9rZTogJyM0Mjg1ZjQnLFxuICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICBzdHJva2VXaWR0aDogJzJweCdcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIGFkZCB0byBzZWxlY3Rpb25cbiAgICAgIC8vIHBvc3NpYmx5LCBkaXNzYWxvdyBzZWxlY3RpbmcgYW5vdGhlciB0eXBlXG4gICAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNhbWVUeXBlID0gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgICAgcmV0dXJuIHNhbWVUeXBlID8gb2JqZWN0cy5hZGQoaW5kZXgpIDogb2JqZWN0cztcbiAgICB9XG4gIH1cblxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0RHJhZyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IHRydWUsXG4gICAgICBkcmFnT3JpZ2luOiB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudClcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZURyYWcgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kcmFnZ2luZykge1xuICAgICAgY29uc3QgeyBkcmFnT3JpZ2luIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnUmVjdDoge1xuICAgICAgICAgIHg6IE1hdGgubWluKGN1cnJlbnQueCwgZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnksIGRyYWdPcmlnaW4ueSksXG4gICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnQueCAtIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhjdXJyZW50LnkgLSBkcmFnT3JpZ2luLnkpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJsYXBzKGEsIGIsIHgsIHkpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgeCkgPCBNYXRoLm1pbihiLCB5KTtcbiAgfVxuXG4gIGJveE92ZXJsYXAoYSwgYikge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXBzKGEubGVmdCwgYS5yaWdodCwgYi5sZWZ0LCBiLnJpZ2h0KSAmJiBcbiAgICAgICAgICAgdGhpcy5vdmVybGFwcyhhLnRvcCwgYS5ib3R0b20sIGIudG9wLCBiLmJvdHRvbSlcbiAgfVxuXG4gIHJlY3RUb0JveCA9IChyZWN0KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QueCxcbiAgICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgICAgdG9wOiByZWN0LnksXG4gICAgICBib3R0b206IHJlY3QueSArIHJlY3QuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHN0b3BEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBkcmFnUmVjdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBpbmRpY2VzID0gdGhpcy5wcm9wcy5vYmplY3RzLm1hcCgob2JqZWN0LCBpbmRleCkgPT4gaW5kZXgpO1xuICAgIGNvbnN0IHRvU2VsZWN0ID0gaW5kaWNlcy5maWx0ZXIoaW5kZXggPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYm94T3ZlcmxhcChcbiAgICAgICAgdGhpcy5yZWN0VG9Cb3goZHJhZ1JlY3QpLFxuICAgICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLmdldEJCb3goaW5kZXgpKVxuICAgICAgKTtcbiAgICB9KTtcbiAgICB0aGlzLnNlbGVjdE9iamVjdHModG9TZWxlY3QpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXB1dGVDb29yZGluYXRlcyhtb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgZGltID0gdGhpcy5zdmdSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LmNsaWVudFggLSBkaW0ubGVmdCxcbiAgICAgIHk6IG1vdXNlRXZlbnQuY2xpZW50WSAtIGRpbS50b3BcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgY3VycmVudGx5SG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgZHJhZ2dpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuICAgIGNvbnN0IGhvdEtleVN0eWxlID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBvdXRsaW5lOiAwXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5c1xuICAgICAgICBzdHlsZT17aG90S2V5U3R5bGV9XG4gICAgICAgIGtleU1hcD17dGhpcy5tYXB9XG4gICAgICAgIGhhbmRsZXJzPXt0aGlzLmhhbmRsZXJzfVxuICAgICAgICBmb2N1c2VkXG4gICAgICAgIGF0dGFjaD17d2luZG93fVxuICAgICAgICBvbk1vdXNlRG93bj17KGV2dCkgPT4gZXZ0LnByZXZlbnREZWZhdWx0KCl9XG4gICAgICA+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICByZWY9e3RoaXMuc3ZnUmVmfVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzdHlsZT17c3R5bGVzfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnN0YXJ0RHJhZ31cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5oYW5kbGVEcmFnfVxuICAgICAgICAgIG9uTW91c2VVcD17dGhpcy5zdG9wRHJhZ31cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclN1cmZhY2UoKX1cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgIWRyYWdnaW5nICYmIChcbiAgICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChjdXJyZW50bHlIb3ZlcmluZyl9XG4gICAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5vbk1vdXNlTGVhdmV9ICBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtzZWxlY3RlZE9iamVjdHNBcnJheS5tYXAoKG9iamVjdEluZGV4LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChvYmplY3RJbmRleCl9XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKG9iamVjdEluZGV4LCBldmVudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuXG4gICAgICAgICAge2RyYWdnaW5nICYmIHRoaXMucmVuZGVyRHJhZ1JlY3QoKX1cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L0hvdEtleXM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NSdcbiAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICsgJ2lOR04wWTNSamNpUGp3dmNtVmpkRDRLUEhKbFkzUWdlRDBpTVRBaUlIazlJakV3SWlCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJRydcbiAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG59O1xuIl19