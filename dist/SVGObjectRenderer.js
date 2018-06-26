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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwib2JqZWN0UmVmcyIsImN1cnJlbnQiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsImNvbXB1dGVDb29yZGluYXRlcyIsIk1hdGgiLCJtaW4iLCJhYnMiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwic3ZnUmVmIiwiZGVsZXRlIiwic2FtZVR5cGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJjbGVhciIsIm1vdXNlRXZlbnQiLCJkaW0iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwibGVmdCIsImNsaWVudFkiLCJ0b3AiLCJyZW5kZXIiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJob3RLZXlTdHlsZSIsIm91dGxpbmUiLCJoYW5kbGVycyIsIndpbmRvdyIsImV2dCIsInN0eWxlcyIsInN0YXJ0RHJhZyIsImhhbmRsZURyYWciLCJzdG9wRHJhZyIsInJlbmRlclN1cmZhY2UiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsInJlbmRlckRyYWdSZWN0IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLEVBQTJCQyxTQUEzQixRQUE0QyxPQUE1QztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxTQUFTQyxPQUFULFFBQXdCLGVBQXhCO0FBRUEsT0FBT0MsU0FBUCxNQUFzQixhQUF0QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFFQSxlQUFlLE1BQU1DLGlCQUFOLFNBQWdDTixTQUFoQyxDQUEwQztBQWdDdkRPLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsbUNBWFg7QUFDTkMsa0JBQVksS0FETjtBQUVOQyx5QkFBbUIsSUFGYjtBQUdOQyx1QkFBaUIsSUFBSUMsR0FBSixFQUhYO0FBSU5DLG1CQUFhLEtBSlA7QUFLTkMsb0JBQWMsSUFMUjtBQU1OQyxnQkFBVSxLQU5KO0FBT05DLGtCQUFZO0FBQUVDLFdBQUcsQ0FBTDtBQUFRQyxXQUFHO0FBQVgsT0FQTjtBQVFOQyxnQkFBVTtBQUFFRixXQUFHLENBQUw7QUFBUUMsV0FBRyxDQUFYO0FBQWNFLGVBQU8sQ0FBckI7QUFBd0JDLGdCQUFRO0FBQWhDO0FBUkosS0FXVzs7QUFBQSx5Q0FNSkMsS0FBRCxJQUFXO0FBQ3ZC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QyxVQUFVNkYsUUFBVixDQUFtQjdGLFVBQVU4RixJQUE3QixDQU5JO0FBT2pCckUscUJBQW1CekIsVUFBVThGLElBUFo7QUFRakJ4RCx5QkFBdUJ0QyxVQUFVK0Y7QUFSaEIsQzs7Z0JBREEzRixpQixrQkFZRztBQUNwQmMsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJpQixXQUFTLEVBSFc7QUFJcEJPLGVBQWEsRUFKTztBQUtwQmxCLHFCQUFtQixNQUFNLENBQUUsQ0FMUDtBQU1wQmEseUJBQXVCO0FBTkgsQzs7QUFxUXhCLE9BQU8sTUFBTTBDLFNBQVM7QUFDcEJnQixtQkFBaUIsc0VBQ2IsbUZBRGEsR0FFYixtRkFGYSxHQUdiLG1GQUhhLEdBSWIseUNBTGdCO0FBTXBCQyxrQkFBZ0I7QUFOSSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGwsXG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHsgeDogMCwgeTogMCB9LFxuICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgb25Nb3VzZURvd24gPSAoaW5kZXgsIGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8g8J+SoSBQcmV2ZW50cyB1c2VyIHNlbGVjdGluZyBhbnkgc3ZnIHRleHRcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpXG4gICAgfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gIH1cblxuICAvKiDimqBcbiAgICAqIGdldEJCb3goKSBtaWdodCBoYXZlIGluc3VmZmljaWVudCBicm93c2VyIHN1cHBvcnQhXG4gICAgKiBUaGUgZnVuY3Rpb24gaGFzIGxpdHRsZSBkb2N1bWVudGF0aW9uLiBJbiBjYXNlIHVzZSBvZiBCQm94IHR1cm5zIG91dFxuICAgICogcHJvYmxlbWF0aWMsIGNvbnNpZGVyIHVzaW5nIGB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClgIGFsb25nIHdpdGhcbiAgICAqICQoJzxzdmc+JykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgdG8gY29ycmVjdCB0aGUgeCBhbmQgeSBvZmZzZXQuXG4gICAgKi9cbiAgZ2V0QkJveCA9IChpbmRleCkgPT4ge1xuICAgIC8vIGRlc3RydWN0IGFuZCBjb25zdHJ1Y3Q7ICBnZXRCQm94IHJldHVybnMgYSBTVkdSZWN0IHdoaWNoIGRvZXMgbm90IHNwcmVhZC5cbiAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMub2JqZWN0UmVmc1tpbmRleF0uY3VycmVudC5nZXRCQm94KCk7XG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgaGFuZGxlcnMgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiB0cnVlIH0pLFxuICAgIG11bHRpU2VsZWN0T2ZmOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IGZhbHNlIH0pXG4gIH07XG5cbiAgbWFwID0ge1xuICAgIG11bHRpU2VsZWN0T246IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5ZG93bicgfSxcbiAgICBtdWx0aVNlbGVjdE9mZjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXl1cCcgfVxuICB9O1xuXG4gIGlzU2VsZWN0ZWRUeXBlID0gKGluZGV4KSA9PlxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XG5cbiAgc2hvdWxkUmVuZGVySG92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IGlzSG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxuICAgIGlmICghaXNIb3ZlcmluZyB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGluZGV4KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBzZWxlY3Rpbmcgb2JqZWN0cyBvZiBzYW1lIHR5cGVcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVuZGVyU3VyZmFjZSA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgb3BhY2l0eT1cIjAuMFwiXG4gICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgIGhlaWdodD1cIjEwMCVcIlxuICAgICAgICBvbk1vdXNlRG93bj17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRHJhZ1JlY3QgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxyZWN0XG4gICAgICAgIHsuLi50aGlzLnN0YXRlLmRyYWdSZWN0fVxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgc3Ryb2tlOiAnIzQyODVmNCcsXG4gICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgIHN0cm9rZVdpZHRoOiAnMnB4J1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnREcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnZ2luZzogdHJ1ZSxcbiAgICAgIGRyYWdPcmlnaW46IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRHJhZyA9IChldmVudCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmRyYWdnaW5nKSB7XG4gICAgICBjb25zdCB7IGRyYWdPcmlnaW4gfSA9IHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdSZWN0OiB7XG4gICAgICAgICAgeDogTWF0aC5taW4oY3VycmVudC54LCBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIHk6IE1hdGgubWluKGN1cnJlbnQueSwgZHJhZ09yaWdpbi55KSxcbiAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoY3VycmVudC54IC0gZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGN1cnJlbnQueSAtIGRyYWdPcmlnaW4ueSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RvcERyYWcgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcHV0ZUNvb3JkaW5hdGVzKG1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBkaW0gPSB0aGlzLnN2Z1JlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1vdXNlRXZlbnQuY2xpZW50WCAtIGRpbS5sZWZ0LFxuICAgICAgeTogbW91c2VFdmVudC5jbGllbnRZIC0gZGltLnRvcFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBjdXJyZW50bHlIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBkcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZE9iamVjdHNBcnJheSA9IFsuLi5zZWxlY3RlZE9iamVjdHNdOyAvLyBDb252ZXJ0IFNldCB0byBBcnJheVxuICAgIGNvbnN0IHJlbmRlckhvdmVyID0gdGhpcy5zaG91bGRSZW5kZXJIb3ZlcihjdXJyZW50bHlIb3ZlcmluZyk7XG4gICAgY29uc3QgaG90S2V5U3R5bGUgPSB7XG4gICAgICB3aWR0aCxcbiAgICAgIG91dGxpbmU6IDBcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlzXG4gICAgICAgIHN0eWxlPXtob3RLZXlTdHlsZX1cbiAgICAgICAga2V5TWFwPXt0aGlzLm1hcH1cbiAgICAgICAgaGFuZGxlcnM9e3RoaXMuaGFuZGxlcnN9XG4gICAgICAgIGZvY3VzZWRcbiAgICAgICAgYXR0YWNoPXt3aW5kb3d9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZXZ0KSA9PiBldnQucHJldmVudERlZmF1bHQoKX1cbiAgICAgID5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHJlZj17dGhpcy5zdmdSZWZ9XG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXtzdHlsZXN9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuc3RhcnREcmFnfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZURyYWd9XG4gICAgICAgICAgb25Nb3VzZVVwPXt0aGlzLnN0b3BEcmFnfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyU3VyZmFjZSgpfVxuXG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cblxuICAgICAgICAgIHtyZW5kZXJIb3ZlciAmJiAhZHJhZ2dpbmcgJiYgKFxuICAgICAgICAgICAgPEhvdmVyUmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KGN1cnJlbnRseUhvdmVyaW5nKX1cbiAgICAgICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLm9uTW91c2VMZWF2ZX0gIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KG9iamVjdEluZGV4KX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24ob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG5cbiAgICAgICAgICB7ZHJhZ2dpbmcgJiYgdGhpcy5yZW5kZXJEcmFnUmVjdCgpfVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvSG90S2V5cz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzdHlsZXMgPSB7XG4gIGJhY2tncm91bmRJbWFnZTogJ3VybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1J1xuICAgICsgJ3ZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwUFNJeU1DSStDanh5WldOMElIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMCdcbiAgICArICdQU0l5TUNJZ1ptbHNiRDBpSTJabVppSStQQzl5WldOMFBnbzhjbVZqZENCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJR1pwYkd3OUknXG4gICAgKyAnaU5HTjBZM1JqY2lQand2Y21WamRENEtQSEpsWTNRZ2VEMGlNVEFpSUhrOUlqRXdJaUIzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHJ1xuICAgICsgJ1pwYkd3OUlpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BDOXpkbWMrKScsXG4gIGJhY2tncm91bmRTaXplOiAnYXV0bydcbn07XG4iXX0=