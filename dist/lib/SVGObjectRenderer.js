function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import HoverRect from './HoverRect';
import SelectRect from './SelectRect';
import DragRect from './DragRect';
import Surface from './Surface';
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
    }, React.createElement(Surface, {
      deselectAll: () => {
        if (this.state.selectedObjects.size > 0) {
          this.setState({
            selectedObjects: new Set()
          }); // ⚡ notify outside world of selection change. convert set to array.

          this.props.onSelectionChange(Array.from(this.state.selectedObjects));
        }
      }
    }), objects.map(this.renderObject), renderHover && !dragging && React.createElement(HoverRect, _extends({}, this.getBBox(currentlyHovering), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiRHJhZ1JlY3QiLCJTdXJmYWNlIiwiSG90S2V5UHJvdmlkZXIiLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc0hvdmVyaW5nIiwiY3VycmVudGx5SG92ZXJpbmciLCJzZWxlY3RlZE9iamVjdHMiLCJTZXQiLCJtdWx0aVNlbGVjdCIsInNlbGVjdGVkVHlwZSIsImRyYWdnaW5nIiwiZHJhZ09yaWdpbiIsIngiLCJ5IiwiZHJhZ1JlY3QiLCJ3aWR0aCIsImhlaWdodCIsImluZGV4Iiwic2V0U3RhdGUiLCJpbmRleGVzIiwibmV3U2VsZWN0aW9uIiwib25TZWxlY3Rpb25DaGFuZ2UiLCJBcnJheSIsImZyb20iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZVNlbGVjdGlvbiIsIm9iamVjdFJlZnMiLCJjdXJyZW50IiwiZ2V0QkJveCIsIm9iamVjdHMiLCJ0eXBlIiwic3RhdGUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJzaXplIiwiaXNTZWxlY3RlZFR5cGUiLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsIm9uTW91c2VPdmVyIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTGVhdmUiLCJkcmFnSW5pdGlhdGVkIiwiY29tcHV0ZUNvb3JkaW5hdGVzIiwiTWF0aCIsIm1pbiIsImFicyIsInJlY3QiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJpbmRpY2VzIiwibWFwIiwidG9TZWxlY3QiLCJmaWx0ZXIiLCJib3hPdmVybGFwIiwicmVjdFRvQm94Iiwic2VsZWN0T2JqZWN0cyIsIk9iamVjdCIsImVudHJpZXMiLCJzdmdSZWYiLCJkZWxldGUiLCJzYW1lVHlwZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwib3ZlcmxhcHMiLCJhIiwiYiIsIm1heCIsIm1vdXNlRXZlbnQiLCJkaW0iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsInJlbmRlciIsInNlbGVjdGVkT2JqZWN0c0FycmF5IiwicmVuZGVySG92ZXIiLCJzaG91bGRSZW5kZXJIb3ZlciIsInN0eWxlcyIsInN0YXJ0RHJhZyIsImhhbmRsZURyYWciLCJzdG9wRHJhZyIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLEVBQTJCQyxTQUEzQixRQUE0QyxPQUE1QztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixjQUF2QjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIsWUFBckI7QUFDQSxPQUFPQyxPQUFQLE1BQW9CLFdBQXBCO0FBQ0EsT0FBT0MsY0FBUCxNQUEyQixrQkFBM0I7QUFFQSxlQUFlLE1BQU1DLGlCQUFOLFNBQWdDUixTQUFoQyxDQUEwQztBQWdDdkRTLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsbUNBWFg7QUFDTkMsa0JBQVksS0FETjtBQUVOQyx5QkFBbUIsSUFGYjtBQUdOQyx1QkFBaUIsSUFBSUMsR0FBSixFQUhYO0FBSU5DLG1CQUFhLEtBSlA7QUFLTkMsb0JBQWMsSUFMUjtBQU1OQyxnQkFBVSxLQU5KO0FBT05DLGtCQUFZO0FBQUVDLFdBQUcsQ0FBTDtBQUFRQyxXQUFHO0FBQVgsT0FQTjtBQVFOQyxnQkFBVTtBQUFFRixXQUFHLENBQUw7QUFB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QnhFLHFCQUFtQjFCLFVBQVVrRyxJQVBaO0FBUWpCNUQseUJBQXVCdEMsVUFBVW1HO0FBUmhCLEM7O2dCQURBN0YsaUIsa0JBWUc7QUFDcEJjLFNBQU8sR0FEYTtBQUVwQkMsVUFBUSxHQUZZO0FBR3BCYyxXQUFTLEVBSFc7QUFJcEJRLGVBQWEsRUFKTztBQUtwQmpCLHFCQUFtQixNQUFNLENBQUUsQ0FMUDtBQU1wQlkseUJBQXVCO0FBTkgsQzs7QUF5UXhCLE9BQU8sTUFBTWdELFNBQVM7QUFDcEJjLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vSG92ZXJSZWN0JztcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vU2VsZWN0UmVjdCc7XG5pbXBvcnQgRHJhZ1JlY3QgZnJvbSAnLi9EcmFnUmVjdCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuL1N1cmZhY2UnO1xuaW1wb3J0IEhvdEtleVByb3ZpZGVyIGZyb20gJy4vSG90S2V5UHJvdmlkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGwsXG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHsgeDogMCwgeTogMCB9LFxuICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgc2VsZWN0T2JqZWN0cyA9IGluZGV4ZXMgPT4ge1xuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kZXhlcyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGluZGV4LCBldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIPCfkqEgUHJldmVudHMgdXNlciBzZWxlY3RpbmcgYW55IHN2ZyB0ZXh0XG5cbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvblxuICAgIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5jdXJyZW50LmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHNob3VsZFJlbmRlckhvdmVyID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBpc0hvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAoIWlzSG92ZXJpbmcgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhpbmRleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBub2RlUmVmPXt0aGlzLm9iamVjdFJlZnNbaW5kZXhdfVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5vbk1vdXNlT3ZlcihpbmRleCl9XG4gICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm9uTW91c2VEb3duKGluZGV4LCBldmVudCl9XG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5vbk1vdXNlTGVhdmV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBtdWx0aVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXG4gICAgICBvYmplY3RzLmRlbGV0ZShpbmRleCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBhZGQgdG8gc2VsZWN0aW9uXG4gICAgICAvLyBwb3NzaWJseSwgZGlzc2Fsb3cgc2VsZWN0aW5nIGFub3RoZXIgdHlwZVxuICAgICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBzYW1lVHlwZSA9IHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICAgIHJldHVybiBzYW1lVHlwZSA/IG9iamVjdHMuYWRkKGluZGV4KSA6IG9iamVjdHM7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyBkZXNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlU2VsZWN0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKG11bHRpU2VsZWN0ICYmIHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmdsZVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9XG4gIH1cblxuICBzdGFydERyYWcgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdJbml0aWF0ZWQ6IHRydWUsXG4gICAgICBkcmFnT3JpZ2luOiB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudClcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZURyYWcgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB7IGRyYWdJbml0aWF0ZWQsIGRyYWdPcmlnaW4gfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IHsgZHJhZ2dpbmcgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoZHJhZ0luaXRpYXRlZCAmJiAhZHJhZ2dpbmcpIHtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dpbmc6IHRydWUsXG4gICAgICAgIGRyYWdSZWN0OiB7XG4gICAgICAgICAgeDogTWF0aC5taW4oY3VycmVudC54LCBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIHk6IE1hdGgubWluKGN1cnJlbnQueSwgZHJhZ09yaWdpbi55KSxcbiAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoY3VycmVudC54IC0gZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGN1cnJlbnQueSAtIGRyYWdPcmlnaW4ueSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcmxhcHMoYSwgYiwgeCwgeSkge1xuICAgIHJldHVybiBNYXRoLm1heChhLCB4KSA8IE1hdGgubWluKGIsIHkpO1xuICB9XG5cbiAgYm94T3ZlcmxhcChhLCBiKSB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcmxhcHMoYS5sZWZ0LCBhLnJpZ2h0LCBiLmxlZnQsIGIucmlnaHQpICYmIFxuICAgICAgICAgICB0aGlzLm92ZXJsYXBzKGEudG9wLCBhLmJvdHRvbSwgYi50b3AsIGIuYm90dG9tKVxuICB9XG5cbiAgcmVjdFRvQm94ID0gKHJlY3QpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogcmVjdC54LFxuICAgICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgICB0b3A6IHJlY3QueSxcbiAgICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgc3RvcERyYWcgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kcmFnZ2luZykge1xuICAgICAgY29uc3QgaW5kaWNlcyA9IHRoaXMucHJvcHMub2JqZWN0cy5tYXAoKG9iamVjdCwgaW5kZXgpID0+IGluZGV4KTtcbiAgICAgIGNvbnN0IHRvU2VsZWN0ID0gaW5kaWNlcy5maWx0ZXIoaW5kZXggPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ib3hPdmVybGFwKFxuICAgICAgICAgIHRoaXMucmVjdFRvQm94KHRoaXMuc3RhdGUuZHJhZ1JlY3QpLFxuICAgICAgICAgIHRoaXMucmVjdFRvQm94KHRoaXMuZ2V0QkJveChpbmRleCkpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VsZWN0T2JqZWN0cyh0b1NlbGVjdCk7XG4gICAgfSBcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZ0luaXRpYXRlZDogZmFsc2UsXG4gICAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXB1dGVDb29yZGluYXRlcyhtb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgZGltID0gdGhpcy5zdmdSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LmNsaWVudFggLSBkaW0ubGVmdCxcbiAgICAgIHk6IG1vdXNlRXZlbnQuY2xpZW50WSAtIGRpbS50b3BcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgY3VycmVudGx5SG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgZHJhZ2dpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlQcm92aWRlciB3aWR0aD17d2lkdGh9XG4gICAgICAgIHNldE11bHRpU2VsZWN0PXttdWx0aVNlbGVjdCA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3QgfSl9XG4gICAgICA+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICByZWY9e3RoaXMuc3ZnUmVmfVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzdHlsZT17c3R5bGVzfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnN0YXJ0RHJhZ31cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5oYW5kbGVEcmFnfVxuICAgICAgICAgIG9uTW91c2VVcD17dGhpcy5zdG9wRHJhZ31cbiAgICAgICAgPlxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KClcbiAgICAgICAgICAgICAgfSk7XG4gIFxuICAgICAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19Lz5cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgIWRyYWdnaW5nICYmIChcbiAgICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChjdXJyZW50bHlIb3ZlcmluZyl9XG4gICAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5vbk1vdXNlTGVhdmV9ICBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtzZWxlY3RlZE9iamVjdHNBcnJheS5tYXAoKG9iamVjdEluZGV4LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChvYmplY3RJbmRleCl9XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKG9iamVjdEluZGV4LCBldmVudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuXG4gICAgICAgICAge2RyYWdnaW5nICYmIDxEcmFnUmVjdCB7Li4udGhpcy5zdGF0ZS5kcmFnUmVjdH0gLz59XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9Ib3RLZXlQcm92aWRlcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzdHlsZXMgPSB7XG4gIGJhY2tncm91bmRJbWFnZTogJ3VybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1J1xuICAgICsgJ3ZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwUFNJeU1DSStDanh5WldOMElIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMCdcbiAgICArICdQU0l5TUNJZ1ptbHNiRDBpSTJabVppSStQQzl5WldOMFBnbzhjbVZqZENCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJR1pwYkd3OUknXG4gICAgKyAnaU5HTjBZM1JqY2lQand2Y21WamRENEtQSEpsWTNRZ2VEMGlNVEFpSUhrOUlqRXdJaUIzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHJ1xuICAgICsgJ1pwYkd3OUlpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BDOXpkbWMrKScsXG4gIGJhY2tncm91bmRTaXplOiAnYXV0bydcbn07XG4iXX0=