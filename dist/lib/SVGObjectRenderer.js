function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import HoverRect from './HoverRect';
import SelectRect from './SelectRect';
import DragRect from './DragRect';
import HotKeyProvider from './HotKeyProvider';
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
    return React.createElement(HotKeyProvider, {
      width: width,
      setMultiSelect: multiSelect => this.setState({
        multiSelect
      })
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
    }))), dragging && React.createElement(DragRect, this.state.dragRect)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiRHJhZ1JlY3QiLCJIb3RLZXlQcm92aWRlciIsIlNWR09iamVjdFJlbmRlcmVyIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzSG92ZXJpbmciLCJjdXJyZW50bHlIb3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiZHJhZ2dpbmciLCJkcmFnT3JpZ2luIiwieCIsInkiLCJkcmFnUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGV4ZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0UmVmcyIsImN1cnJlbnQiLCJnZXRCQm94Iiwib2JqZWN0cyIsInR5cGUiLCJzdGF0ZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsImRyYWdJbml0aWF0ZWQiLCJjb21wdXRlQ29vcmRpbmF0ZXMiLCJNYXRoIiwibWluIiwiYWJzIiwicmVjdCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImluZGljZXMiLCJtYXAiLCJ0b1NlbGVjdCIsImZpbHRlciIsImJveE92ZXJsYXAiLCJyZWN0VG9Cb3giLCJzZWxlY3RPYmplY3RzIiwiT2JqZWN0IiwiZW50cmllcyIsInN2Z1JlZiIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJvdmVybGFwcyIsImEiLCJiIiwibWF4IiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwicmVuZGVyIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJyZW5kZXJIb3ZlciIsInNob3VsZFJlbmRlckhvdmVyIiwic3R5bGVzIiwic3RhcnREcmFnIiwiaGFuZGxlRHJhZyIsInN0b3BEcmFnIiwicmVuZGVyU3VyZmFjZSIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLEVBQTJCQyxTQUEzQixRQUE0QyxPQUE1QztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIsWUFBckI7QUFDQSxPQUFPQyxjQUFQLE1BQTJCLGtCQUEzQjtBQUVBLGVBQWUsTUFBTUMsaUJBQU4sU0FBZ0NQLFNBQWhDLENBQTBDO0FBZ0N2RFEsY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOOztBQURpQixtQ0FYWDtBQUNOQyxrQkFBWSxLQUROO0FBRU5DLHlCQUFtQixJQUZiO0FBR05DLHVCQUFpQixJQUFJQyxHQUFKLEVBSFg7QUFJTkMsbUJBQWEsS0FKUDtBQUtOQyxvQkFBYyxJQUxSO0FBTU5DLGdCQUFVLEtBTko7QUFPTkMsa0JBQVk7QUFBRUMsV0FBRyxDQUFMO0FBQVFDLFdBQUc7QUFBWCxPQVBOO0FBUU5DLGdCQUFVO0FBQUVGLFdBQUcsQ0FBTDtBQUFRQyxXQUFHLENBQVg7QUFBY0UsZUFB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LFVBQVUrRixNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCdEQsZUFBYTFDLFVBQVVpRyxRQUFWLENBQW1CakcsVUFBVWtHLElBQTdCLENBTkk7QUFPakJ6RSxxQkFBbUJ6QixVQUFVa0csSUFQWjtBQVFqQjdELHlCQUF1QnJDLFVBQVVtRztBQVJoQixDOztnQkFEQTlGLGlCLGtCQVlHO0FBQ3BCYyxTQUFPLEdBRGE7QUFFcEJDLFVBQVEsR0FGWTtBQUdwQmMsV0FBUyxFQUhXO0FBSXBCUSxlQUFhLEVBSk87QUFLcEJqQixxQkFBbUIsTUFBTSxDQUFFLENBTFA7QUFNcEJZLHlCQUF1QjtBQU5ILEM7O0FBdVJ4QixPQUFPLE1BQU1nRCxTQUFTO0FBQ3BCZSxtQkFBaUIsc0VBQ2IsbUZBRGEsR0FFYixtRkFGYSxHQUdiLG1GQUhhLEdBSWIseUNBTGdCO0FBTXBCQyxrQkFBZ0I7QUFOSSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuaW1wb3J0IERyYWdSZWN0IGZyb20gJy4vRHJhZ1JlY3QnO1xuaW1wb3J0IEhvdEtleVByb3ZpZGVyIGZyb20gJy4vSG90S2V5UHJvdmlkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGwsXG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHsgeDogMCwgeTogMCB9LFxuICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgc2VsZWN0T2JqZWN0cyA9IGluZGV4ZXMgPT4ge1xuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kZXhlcyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGluZGV4LCBldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIPCfkqEgUHJldmVudHMgdXNlciBzZWxlY3RpbmcgYW55IHN2ZyB0ZXh0XG5cbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvblxuICAgIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5jdXJyZW50LmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlclN1cmZhY2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIG9wYWNpdHk9XCIwLjBcIlxuICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICBoZWlnaHQ9XCIxMDAlXCJcbiAgICAgICAgb25Nb3VzZURvd249eyhldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnREcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnSW5pdGlhdGVkOiB0cnVlLFxuICAgICAgZHJhZ09yaWdpbjogdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBkcmFnSW5pdGlhdGVkLCBkcmFnT3JpZ2luIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCB7IGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGRyYWdJbml0aWF0ZWQgJiYgIWRyYWdnaW5nKSB7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnaW5nOiB0cnVlLFxuICAgICAgICBkcmFnUmVjdDoge1xuICAgICAgICAgIHg6IE1hdGgubWluKGN1cnJlbnQueCwgZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnksIGRyYWdPcmlnaW4ueSksXG4gICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnQueCAtIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhjdXJyZW50LnkgLSBkcmFnT3JpZ2luLnkpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJsYXBzKGEsIGIsIHgsIHkpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgeCkgPCBNYXRoLm1pbihiLCB5KTtcbiAgfVxuXG4gIGJveE92ZXJsYXAoYSwgYikge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXBzKGEubGVmdCwgYS5yaWdodCwgYi5sZWZ0LCBiLnJpZ2h0KSAmJiBcbiAgICAgICAgICAgdGhpcy5vdmVybGFwcyhhLnRvcCwgYS5ib3R0b20sIGIudG9wLCBiLmJvdHRvbSlcbiAgfVxuXG4gIHJlY3RUb0JveCA9IChyZWN0KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QueCxcbiAgICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgICAgdG9wOiByZWN0LnksXG4gICAgICBib3R0b206IHJlY3QueSArIHJlY3QuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHN0b3BEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLnByb3BzLm9iamVjdHMubWFwKChvYmplY3QsIGluZGV4KSA9PiBpbmRleCk7XG4gICAgICBjb25zdCB0b1NlbGVjdCA9IGluZGljZXMuZmlsdGVyKGluZGV4ID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm94T3ZlcmxhcChcbiAgICAgICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLnN0YXRlLmRyYWdSZWN0KSxcbiAgICAgICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLmdldEJCb3goaW5kZXgpKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNlbGVjdE9iamVjdHModG9TZWxlY3QpO1xuICAgIH0gXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWdJbml0aWF0ZWQ6IGZhbHNlLFxuICAgICAgZHJhZ1JlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wdXRlQ29vcmRpbmF0ZXMobW91c2VFdmVudCkge1xuICAgIGNvbnN0IGRpbSA9IHRoaXMuc3ZnUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogbW91c2VFdmVudC5jbGllbnRYIC0gZGltLmxlZnQsXG4gICAgICB5OiBtb3VzZUV2ZW50LmNsaWVudFkgLSBkaW0udG9wXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XG4gICAgY29uc3QgcmVuZGVySG92ZXIgPSB0aGlzLnNob3VsZFJlbmRlckhvdmVyKGN1cnJlbnRseUhvdmVyaW5nKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5UHJvdmlkZXIgd2lkdGg9e3dpZHRofVxuICAgICAgICBzZXRNdWx0aVNlbGVjdD17bXVsdGlTZWxlY3QgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0IH0pfVxuICAgICAgPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgcmVmPXt0aGlzLnN2Z1JlZn1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlc31cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zdGFydERyYWd9XG4gICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuaGFuZGxlRHJhZ31cbiAgICAgICAgICBvbk1vdXNlVXA9e3RoaXMuc3RvcERyYWd9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTdXJmYWNlKCl9XG5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3JlbmRlckhvdmVyICYmICFkcmFnZ2luZyAmJiAoXG4gICAgICAgICAgICA8SG92ZXJSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3goY3VycmVudGx5SG92ZXJpbmcpfVxuICAgICAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMub25Nb3VzZUxlYXZlfSAgXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3gob2JqZWN0SW5kZXgpfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cblxuICAgICAgICAgIHtkcmFnZ2luZyAmJiA8RHJhZ1JlY3Qgey4uLnRoaXMuc3RhdGUuZHJhZ1JlY3R9IC8+fVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NSdcbiAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICsgJ2lOR04wWTNSamNpUGp3dmNtVmpkRDRLUEhKbFkzUWdlRDBpTVRBaUlIazlJakV3SWlCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJRydcbiAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG59O1xuIl19