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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJIb3RLZXlzIiwiSG92ZXJSZWN0IiwiU2VsZWN0UmVjdCIsIlNWR09iamVjdFJlbmRlcmVyIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzSG92ZXJpbmciLCJjdXJyZW50bHlIb3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiZHJhZ2dpbmciLCJkcmFnT3JpZ2luIiwieCIsInkiLCJkcmFnUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGV4ZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0UmVmcyIsImN1cnJlbnQiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsInN0YXRlIiwibXVsdGlwbGVUeXBlU2VsZWN0aW9uIiwiaGFzIiwic2l6ZSIsImlzU2VsZWN0ZWRUeXBlIiwib2JqZWN0Iiwib2JqZWN0VHlwZXMiLCJPYmplY3RDb21wb25lbnQiLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VEb3duIiwib25Nb3VzZUxlYXZlIiwic3Ryb2tlIiwiZmlsbCIsInN0cm9rZVdpZHRoIiwiZHJhZ0luaXRpYXRlZCIsImNvbXB1dGVDb29yZGluYXRlcyIsIk1hdGgiLCJtaW4iLCJhYnMiLCJyZWN0IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwiaW5kaWNlcyIsIm1hcCIsInRvU2VsZWN0IiwiZmlsdGVyIiwiYm94T3ZlcmxhcCIsInJlY3RUb0JveCIsInNlbGVjdE9iamVjdHMiLCJPYmplY3QiLCJlbnRyaWVzIiwic3ZnUmVmIiwiZGVsZXRlIiwic2FtZVR5cGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJjbGVhciIsIm92ZXJsYXBzIiwiYSIsImIiLCJtYXgiLCJtb3VzZUV2ZW50IiwiZGltIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJyZW5kZXIiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJob3RLZXlTdHlsZSIsIm91dGxpbmUiLCJoYW5kbGVycyIsIndpbmRvdyIsImV2dCIsInN0eWxlcyIsInN0YXJ0RHJhZyIsImhhbmRsZURyYWciLCJzdG9wRHJhZyIsInJlbmRlclN1cmZhY2UiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsInJlbmRlckRyYWdSZWN0IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLEVBQTJCQyxTQUEzQixRQUE0QyxPQUE1QztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFDQSxTQUFTQyxPQUFULFFBQXdCLGVBQXhCO0FBRUEsT0FBT0MsU0FBUCxNQUFzQixhQUF0QjtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7QUFFQSxlQUFlLE1BQU1DLGlCQUFOLFNBQWdDTixTQUFoQyxDQUEwQztBQWdDdkRPLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsbUNBWFg7QUFDTkMsa0JBQVksS0FETjtBQUVOQyx5QkFBbUIsSUFGYjtBQUdOQyx1QkFBaUIsSUFBSUMsR0FBSixFQUhYO0FBSU5DLG1CQUFhLEtBSlA7QUFLTkMsb0JBQWMsSUFMUjtBQU1OQyxnQkFBVSxLQU5KO0FBT05DLGtCQUFZO0FBQUVDLFdBQUcsQ0FBTDtBQUFRQyxXQUFHO0FBQVgsT0FQTjtBQVFOQyxnQkFBVTtBQUFFRixXQUFHLENBQUw7QUFBUUMsV0FBRyxDQUFYO0FBQWNFLGVBQU8sQ0FBckI7QUFBd0JDLGdCQUFRO0FBQWhDO0FBUkosS0FXVzs7QUFBQSx5Q0FNSkMsS0FBRCxJQUFXO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUFFZCxvQkFBWSxJQUFkO0FBQW9CQywyQkFBbUJZO0FBQXZDLE9BQWQ7QUFDRCxLQVJrQjs7QUFBQSwwQ0FVSixNQUFNLEtBQUtDLFFBQUwsQ0FBYztBQUFFZCxrQkFBWTtBQUFkLEtBQWQsQ0FWRjs7QUFBQSwyQ0FZSGUsV0FBVztBQUN6QixZQUFNQyxlQUFlLElBQUliLEdBQUosQ0FBUVksT0FBUixDQUFyQjtBQUNBLFdBQUtELFFBQUwsQ0FBYztBQUFFWix5QkFBaUJjO0FBQW5CLE9BQWQsRUFGeUIsQ0FJekI7O0FBQ0EsV0FBS2pCLEtBQUwsQ0FBV2tCLGlCQUFYLENBQTZCQyxNQUFNQyxJQUFOLENBQVdILFlBQVgsQ0FBN0I7QUFDRCxLQWxCa0I7O0FBQUEseUNBb0JMLENBQUNILEtBQUQsRUFBUU8sS0FBUixLQUFrQjtBQUM5QkEsWUFBTUMsY0FBTixHQUQ4QixDQUNOOztBQUV4QixZQUFNTCxlQUFlLEtBQUtNLGdCQUFMLENBQXNCVCxLQUF0QixDQUFyQjtBQUVBLFdBQUtDLFFBQUwsQ0FBYztBQUNaWix5QkFBaUJjO0FBREwsT0FBZCxFQUw4QixDQVM5Qjs7QUFDQSxXQUFLakIsS0FBTCxDQUFXa0IsaUJBQVgsQ0FBNkJDLE1BQU1DLElBQU4sQ0FBV0gsWUFBWCxDQUE3QjtBQUNELEtBL0JrQjs7QUFBQSxxQ0F1Q1JILEtBQUQsSUFBVztBQUNuQjtBQUNBLFlBQU07QUFBRUwsU0FBRjtBQUFLQyxTQUFMO0FBQVFFLGFBQVI7QUFBZUM7QUFBZixVQUEwQixLQUFLVyxVQUFMLENBQWdCVixLQUFoQixFQUF1QlcsT0FBdkIsQ0FBK0JDLE9BQS9CLEVBQWhDO0FBQ0EsYUFBTztBQUFFakIsU0FBRjtBQUFLQyxTQUFMO0FBQVFFLGFBQVI7QUFBZUM7QUFBZixPQUFQO0FBQ0QsS0EzQ2tCOztBQUFBLHNDQTZDUjtBQUNUYyxxQkFBZSxNQUFNLEtBQUtaLFFBQUwsQ0FBYztBQUFFVixxQkFBYTtBQUFmLE9BQWQsQ0FEWjtBQUVUdUIsc0JBQWdCLE1BQU0sS0FBS2IsUUFBTCxDQUFjO0FBQUVWLHFCQUFhO0FBQWYsT0FBZDtBQUZiLEtBN0NROztBQUFBLGlDQWtEYjtBQUNKc0IscUJBQWU7QUFBRUUsa0JBQVUsTUFBWjtBQUFvQkMsZ0JBQVE7QUFBNUIsT0FEWDtBQUVKRixzQkFBZ0I7QUFBRUMsa0JBQVUsTUFBWjtBQUFvQkMsZ0JBQVE7QUFBNUI7QUFGWixLQWxEYTs7QUFBQSw0Q0F1RERoQixLQUFELElBQ2YsS0FBS2QsS0FBTCxDQUFXK0IsT0FBWCxDQUFtQmpCLEtBQW5CLEVBQTBCa0IsSUFBMUIsS0FBbUMsS0FBS0MsS0FBTCxDQUFXM0IsWUF4RDdCOztBQUFBLCtDQTBERVEsS0FBRCxJQUFXO0FBQzdCLFlBQU07QUFBRWIsa0JBQUY7QUFBY0UsdUJBQWQ7QUFBK0JFO0FBQS9CLFVBQStDLEtBQUs0QixLQUExRDtBQUNBLFlBQU07QUFBRUM7QUFBRixVQUE0QixLQUFLbEMsS0FBdkMsQ0FGNkIsQ0FJN0I7O0FBQ0EsVUFBSSxDQUFDQyxVQUFELElBQWVFLGdCQUFnQmdDLEdBQWhCLENBQW9CckIsS0FBcEIsQ0FBbkIsRUFBK0M7QUFDN0MsZUFBTyxLQUFQO0FBQ0QsT0FQNEIsQ0FTN0I7OztBQUNBLFVBQUlYLGdCQUFnQmlDLElBQWhCLEdBQXVCLENBQXZCLElBQTRCL0IsV0FBaEMsRUFBNkM7QUFDM0MsZUFBTyxLQUFLZ0MsY0FBTCxDQUFvQnZCLEtBQXBCLEtBQThCb0IscUJBQXJDO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0QsS0F6RWtCOztBQUFBLDJDQTJFSCxNQUFNO0FBQ3BCLGFBQ0U7QUFDRSxpQkFBUSxLQURWO0FBRUUsZUFBTSxNQUZSO0FBR0UsZ0JBQU8sTUFIVDtBQUlFLHFCQUFjYixLQUFELElBQVc7QUFDdEJBLGdCQUFNQyxjQUFOOztBQUNBLGNBQUksS0FBS1csS0FBTCxDQUFXOUIsZUFBWCxDQUEyQmlDLElBQTNCLEtBQW9DLENBQXhDLEVBQTJDO0FBQ3pDO0FBQ0Q7O0FBRUQsZUFBS3JCLFFBQUwsQ0FBYztBQUNaWiw2QkFBaUIsSUFBSUMsR0FBSjtBQURMLFdBQWQsRUFOc0IsQ0FVdEI7O0FBQ0EsZUFBS0osS0FBTCxDQUFXa0IsaUJBQVgsQ0FBNkJDLE1BQU1DLElBQU4sQ0FBVyxLQUFLYSxLQUFMLENBQVc5QixlQUF0QixDQUE3QjtBQUNEO0FBaEJILFFBREY7QUFvQkQsS0FoR2tCOztBQUFBLDBDQWtHSixDQUFDbUMsTUFBRCxFQUFTeEIsS0FBVCxLQUFtQjtBQUNoQyxZQUFNO0FBQUV5QjtBQUFGLFVBQWtCLEtBQUt2QyxLQUE3QjtBQUNBLFlBQU13QyxrQkFBa0JELFlBQVlELE9BQU9OLElBQW5CLENBQXhCO0FBRUEsYUFDRSxvQkFBQyxlQUFELGVBQ01NLE1BRE47QUFFRSxhQUFLeEIsS0FGUDtBQUdFLGlCQUFTLEtBQUtVLFVBQUwsQ0FBZ0JWLEtBQWhCLENBSFg7QUFJRSxxQkFBYSxNQUFNLEtBQUsyQixXQUFMLENBQWlCM0IsS0FBakIsQ0FKckI7QUFLRSxxQkFBYU8sU0FBUyxLQUFLcUIsV0FBTCxDQUFpQjVCLEtBQWpCLEVBQXdCTyxLQUF4QixDQUx4QjtBQU1FLHNCQUFjLEtBQUtzQjtBQU5yQixTQURGO0FBVUQsS0FoSGtCOztBQUFBLDRDQWtIRixNQUFNO0FBQ3JCLGFBQ0UseUNBQ00sS0FBS1YsS0FBTCxDQUFXdEIsUUFEakI7QUFFRSxjQUFLLE1BRlA7QUFHRSxlQUFPO0FBQ0xpQyxrQkFBUSxTQURIO0FBRUxDLGdCQUFNLE1BRkQ7QUFHTEMsdUJBQWE7QUFIUjtBQUhULFNBREY7QUFXRCxLQTlIa0I7O0FBQUEsdUNBbUtOekIsS0FBRCxJQUFXO0FBQ3JCLFdBQUtOLFFBQUwsQ0FBYztBQUNaZ0MsdUJBQWUsSUFESDtBQUVadkMsb0JBQVksS0FBS3dDLGtCQUFMLENBQXdCM0IsS0FBeEI7QUFGQSxPQUFkO0FBSUQsS0F4S2tCOztBQUFBLHdDQTBLTEEsS0FBRCxJQUFXO0FBQ3RCLFlBQU07QUFBRTBCLHFCQUFGO0FBQWlCdkM7QUFBakIsVUFBZ0MsS0FBS3lCLEtBQTNDO0FBQ0EsVUFBSTtBQUFFMUI7QUFBRixVQUFlLEtBQUswQixLQUF4Qjs7QUFFQSxVQUFJYyxpQkFBaUIsQ0FBQ3hDLFFBQXRCLEVBQWdDO0FBQzlCQSxtQkFBVyxJQUFYO0FBQ0Q7O0FBRUQsVUFBSUEsUUFBSixFQUFjO0FBQ1osY0FBTWtCLFVBQVUsS0FBS3VCLGtCQUFMLENBQXdCM0IsS0FBeEIsQ0FBaEI7QUFDQSxhQUFLTixRQUFMLENBQWM7QUFDWlIsb0JBQVUsSUFERTtBQUVaSSxvQkFBVTtBQUNSRixlQUFHd0MsS0FBS0MsR0FBTCxDQUFTekIsUUFBUWhCLENBQWpCLEVBQW9CRCxXQUFXQyxDQUEvQixDQURLO0FBRVJDLGVBQUd1QyxLQUFLQyxHQUFMLENBQVN6QixRQUFRZixDQUFqQixFQUFvQkYsV0FBV0UsQ0FBL0IsQ0FGSztBQUdSRSxtQkFBT3FDLEtBQUtFLEdBQUwsQ0FBUzFCLFFBQVFoQixDQUFSLEdBQVlELFdBQVdDLENBQWhDLENBSEM7QUFJUkksb0JBQVFvQyxLQUFLRSxHQUFMLENBQVMxQixRQUFRZixDQUFSLEdBQVlGLFdBQVdFLENBQWhDO0FBSkE7QUFGRSxTQUFkO0FBU0Q7QUFDRixLQTlMa0I7O0FBQUEsdUNBeU1OMEMsSUFBRCxJQUFVO0FBQ3BCLGFBQU87QUFDTEMsY0FBTUQsS0FBSzNDLENBRE47QUFFTDZDLGVBQU9GLEtBQUszQyxDQUFMLEdBQVMyQyxLQUFLeEMsS0FGaEI7QUFHTDJDLGFBQUtILEtBQUsxQyxDQUhMO0FBSUw4QyxnQkFBUUosS0FBSzFDLENBQUwsR0FBUzBDLEtBQUt2QztBQUpqQixPQUFQO0FBTUQsS0FoTmtCOztBQUFBLHNDQWtOUFEsS0FBRCxJQUFXO0FBQ3BCLFVBQUksS0FBS1ksS0FBTCxDQUFXMUIsUUFBZixFQUF5QjtBQUN2QixjQUFNa0QsVUFBVSxLQUFLekQsS0FBTCxDQUFXK0IsT0FBWCxDQUFtQjJCLEdBQW5CLENBQXVCLENBQUNwQixNQUFELEVBQVN4QixLQUFULEtBQW1CQSxLQUExQyxDQUFoQjtBQUNBLGNBQU02QyxXQUFXRixRQUFRRyxNQUFSLENBQWU5QyxTQUFTO0FBQ3ZDLGlCQUFPLEtBQUsrQyxVQUFMLENBQ0wsS0FBS0MsU0FBTCxDQUFlLEtBQUs3QixLQUFMLENBQVd0QixRQUExQixDQURLLEVBRUwsS0FBS21ELFNBQUwsQ0FBZSxLQUFLcEMsT0FBTCxDQUFhWixLQUFiLENBQWYsQ0FGSyxDQUFQO0FBSUQsU0FMZ0IsQ0FBakI7QUFNQSxhQUFLaUQsYUFBTCxDQUFtQkosUUFBbkI7QUFDRDs7QUFFRCxXQUFLNUMsUUFBTCxDQUFjO0FBQ1pSLGtCQUFVLEtBREU7QUFFWndDLHVCQUFlLEtBRkg7QUFHWnBDLGtCQUFVO0FBQUVGLGFBQUcsQ0FBTDtBQUFRQyxhQUFHLENBQVg7QUFBY0UsaUJBQU8sQ0FBckI7QUFBd0JDLGtCQUFRO0FBQWhDO0FBSEUsT0FBZDtBQUtELEtBbk9rQjs7QUFFakIsU0FBS1csVUFBTCxHQUFrQndDLE9BQU9DLE9BQVAsQ0FBZWpFLE1BQU0rQixPQUFyQixFQUE4QjJCLEdBQTlCLENBQWtDLE1BQU1qRSxXQUF4QyxDQUFsQjtBQUNBLFNBQUt5RSxNQUFMLEdBQWN6RSxXQUFkO0FBQ0Q7O0FBNEhEWSxjQUFZUyxLQUFaLEVBQW1CaUIsT0FBbkIsRUFBNEI7QUFDMUIsUUFBSUEsUUFBUUksR0FBUixDQUFZckIsS0FBWixDQUFKLEVBQXdCO0FBQUU7QUFDeEJpQixjQUFRb0MsTUFBUixDQUFlckQsS0FBZjtBQUNBLGFBQU9pQixPQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQUU7QUFDUDtBQUNBLFlBQU07QUFBRUc7QUFBRixVQUE0QixLQUFLbEMsS0FBdkM7QUFDQSxZQUFNb0UsV0FBVyxLQUFLL0IsY0FBTCxDQUFvQnZCLEtBQXBCLEtBQThCb0IscUJBQS9DO0FBQ0EsYUFBT2tDLFdBQVdyQyxRQUFRc0MsR0FBUixDQUFZdkQsS0FBWixDQUFYLEdBQWdDaUIsT0FBdkM7QUFDRDtBQUNGOztBQUVEdUMsZUFBYXhELEtBQWIsRUFBb0JpQixPQUFwQixFQUE2QjtBQUMzQixRQUFJQSxRQUFRSSxHQUFSLENBQVlyQixLQUFaLENBQUosRUFBd0I7QUFBRTtBQUN4QmlCLGNBQVF3QyxLQUFSO0FBQ0EsYUFBT3hDLE9BQVA7QUFDRCxLQUhELE1BR087QUFBRTtBQUNQQSxjQUFRd0MsS0FBUjtBQUNBLFdBQUt4RCxRQUFMLENBQWM7QUFDWlQsc0JBQWMsS0FBS04sS0FBTCxDQUFXK0IsT0FBWCxDQUFtQmpCLEtBQW5CLEVBQTBCa0I7QUFENUIsT0FBZDtBQUdBLGFBQU9ELFFBQVFzQyxHQUFSLENBQVl2RCxLQUFaLENBQVA7QUFDRDtBQUNGOztBQUVEUyxtQkFBaUJULEtBQWpCLEVBQXdCO0FBQ3RCLFVBQU07QUFBRVgscUJBQUY7QUFBbUJFO0FBQW5CLFFBQW1DLEtBQUs0QixLQUE5Qzs7QUFFQSxRQUFJNUIsZUFBZUYsZ0JBQWdCaUMsSUFBaEIsR0FBdUIsQ0FBMUMsRUFBNkM7QUFDM0MsYUFBTyxLQUFLL0IsV0FBTCxDQUFpQlMsS0FBakIsRUFBd0JYLGVBQXhCLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLEtBQUttRSxZQUFMLENBQWtCeEQsS0FBbEIsRUFBeUJYLGVBQXpCLENBQVA7QUFDRDtBQUNGOztBQStCRHFFLFdBQVNDLENBQVQsRUFBWUMsQ0FBWixFQUFlakUsQ0FBZixFQUFrQkMsQ0FBbEIsRUFBcUI7QUFDbkIsV0FBT3VDLEtBQUswQixHQUFMLENBQVNGLENBQVQsRUFBWWhFLENBQVosSUFBaUJ3QyxLQUFLQyxHQUFMLENBQVN3QixDQUFULEVBQVloRSxDQUFaLENBQXhCO0FBQ0Q7O0FBRURtRCxhQUFXWSxDQUFYLEVBQWNDLENBQWQsRUFBaUI7QUFDZixXQUFPLEtBQUtGLFFBQUwsQ0FBY0MsRUFBRXBCLElBQWhCLEVBQXNCb0IsRUFBRW5CLEtBQXhCLEVBQStCb0IsRUFBRXJCLElBQWpDLEVBQXVDcUIsRUFBRXBCLEtBQXpDLEtBQ0EsS0FBS2tCLFFBQUwsQ0FBY0MsRUFBRWxCLEdBQWhCLEVBQXFCa0IsRUFBRWpCLE1BQXZCLEVBQStCa0IsRUFBRW5CLEdBQWpDLEVBQXNDbUIsRUFBRWxCLE1BQXhDLENBRFA7QUFFRDs7QUE4QkRSLHFCQUFtQjRCLFVBQW5CLEVBQStCO0FBQzdCLFVBQU1DLE1BQU0sS0FBS1gsTUFBTCxDQUFZekMsT0FBWixDQUFvQnFELHFCQUFwQixFQUFaO0FBRUEsV0FBTztBQUNMckUsU0FBR21FLFdBQVdHLE9BQVgsR0FBcUJGLElBQUl4QixJQUR2QjtBQUVMM0MsU0FBR2tFLFdBQVdJLE9BQVgsR0FBcUJILElBQUl0QjtBQUZ2QixLQUFQO0FBSUQ7O0FBRUQwQixXQUFTO0FBQ1AsVUFBTTtBQUFFckUsV0FBRjtBQUFTQyxZQUFUO0FBQWlCa0I7QUFBakIsUUFBNkIsS0FBSy9CLEtBQXhDO0FBQ0EsVUFBTTtBQUFFRSx1QkFBRjtBQUFxQkMscUJBQXJCO0FBQXNDSTtBQUF0QyxRQUFtRCxLQUFLMEIsS0FBOUQ7QUFDQSxVQUFNaUQsdUJBQXVCLENBQUMsR0FBRy9FLGVBQUosQ0FBN0IsQ0FITyxDQUc0Qzs7QUFDbkQsVUFBTWdGLGNBQWMsS0FBS0MsaUJBQUwsQ0FBdUJsRixpQkFBdkIsQ0FBcEI7QUFDQSxVQUFNbUYsY0FBYztBQUNsQnpFLFdBRGtCO0FBRWxCMEUsZUFBUztBQUZTLEtBQXBCO0FBS0EsV0FDRSxvQkFBQyxPQUFEO0FBQ0UsYUFBT0QsV0FEVDtBQUVFLGNBQVEsS0FBSzNCLEdBRmY7QUFHRSxnQkFBVSxLQUFLNkIsUUFIakI7QUFJRSxtQkFKRjtBQUtFLGNBQVFDLE1BTFY7QUFNRSxtQkFBY0MsR0FBRCxJQUFTQSxJQUFJbkUsY0FBSjtBQU54QixPQVFFO0FBQ0UsV0FBSyxLQUFLNEMsTUFEWjtBQUVFLGFBQU90RCxLQUZUO0FBR0UsY0FBUUMsTUFIVjtBQUlFLGFBQU82RSxNQUpUO0FBS0UsbUJBQWEsS0FBS0MsU0FMcEI7QUFNRSxtQkFBYSxLQUFLQyxVQU5wQjtBQU9FLGlCQUFXLEtBQUtDO0FBUGxCLE9BU0csS0FBS0MsYUFBTCxFQVRILEVBV0cvRCxRQUFRMkIsR0FBUixDQUFZLEtBQUtxQyxZQUFqQixDQVhILEVBYUdaLGVBQWUsQ0FBQzVFLFFBQWhCLElBQ0Msb0JBQUMsU0FBRCxlQUNNLEtBQUttQixPQUFMLENBQWF4QixpQkFBYixDQUROO0FBRUUsaUJBQVcsS0FBS3lDO0FBRmxCLE9BZEosRUFvQkd1QyxxQkFBcUJ4QixHQUFyQixDQUF5QixDQUFDc0MsV0FBRCxFQUFjbEYsS0FBZCxLQUN4QixvQkFBQyxVQUFELGVBQ00sS0FBS1ksT0FBTCxDQUFhc0UsV0FBYixDQUROO0FBRUUsV0FBS2xGLEtBRlA7QUFHRSxjQUFTTyxLQUFELElBQVcsS0FBS3FCLFdBQUwsQ0FBaUJzRCxXQUFqQixFQUE4QjNFLEtBQTlCO0FBSHJCLE9BREQsQ0FwQkgsRUE0QkdkLFlBQVksS0FBSzBGLGNBQUwsRUE1QmYsQ0FSRixDQURGO0FBeUNEOztBQWpVc0Q7O2dCQUFwQ25HLGlCLGVBQ0E7QUFDakJjLFNBQU9sQixVQUFVd0csTUFEQTtBQUVqQnJGLFVBQVFuQixVQUFVd0csTUFGRDtBQUdqQm5FLFdBQVNyQyxVQUFVeUcsT0FBVixDQUFrQnpHLFVBQVUwRyxLQUFWLENBQWdCO0FBQ3pDcEUsVUFBTXRDLFVBQVUyRyxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCL0QsZUFBYTdDLFVBQVU2RyxRQUFWLENBQW1CN0csVUFBVThHLElBQTdCLENBTkk7QUFPakJ0RixxQkFBbUJ4QixVQUFVOEcsSUFQWjtBQVFqQnRFLHlCQUF1QnhDLFVBQVUrRztBQVJoQixDOztnQkFEQTNHLGlCLGtCQVlHO0FBQ3BCYyxTQUFPLEdBRGE7QUFFcEJDLFVBQVEsR0FGWTtBQUdwQmtCLFdBQVMsRUFIVztBQUlwQlEsZUFBYSxFQUpPO0FBS3BCckIscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCZ0IseUJBQXVCO0FBTkgsQzs7QUF3VHhCLE9BQU8sTUFBTXdELFNBQVM7QUFDcEJnQixtQkFBaUIsc0VBQ2IsbUZBRGEsR0FFYixtRkFGYSxHQUdiLG1GQUhhLEdBSWIseUNBTGdCO0FBTXBCQyxrQkFBZ0I7QUFOSSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGwsXG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHsgeDogMCwgeTogMCB9LFxuICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgICB0aGlzLnN2Z1JlZiA9IGNyZWF0ZVJlZigpO1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgc2VsZWN0T2JqZWN0cyA9IGluZGV4ZXMgPT4ge1xuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kZXhlcyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGluZGV4LCBldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIPCfkqEgUHJldmVudHMgdXNlciBzZWxlY3RpbmcgYW55IHN2ZyB0ZXh0XG5cbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvblxuICAgIH0pO1xuXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5jdXJyZW50LmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IHRydWUgfSksXG4gICAgbXVsdGlTZWxlY3RPZmY6ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogZmFsc2UgfSlcbiAgfTtcblxuICBtYXAgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXlkb3duJyB9LFxuICAgIG11bHRpU2VsZWN0T2ZmOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleXVwJyB9XG4gIH07XG5cbiAgaXNTZWxlY3RlZFR5cGUgPSAoaW5kZXgpID0+XG4gICAgdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkVHlwZTtcblxuICBzaG91bGRSZW5kZXJIb3ZlciA9IChpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgaXNIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKCFpc0hvdmVyaW5nIHx8IHNlbGVjdGVkT2JqZWN0cy5oYXMoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW5kZXJTdXJmYWNlID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICBvcGFjaXR5PVwiMC4wXCJcbiAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXG4gICAgICAgIG9uTW91c2VEb3duPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyT2JqZWN0ID0gKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IE9iamVjdENvbXBvbmVudCA9IG9iamVjdFR5cGVzW29iamVjdC50eXBlXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8T2JqZWN0Q29tcG9uZW50XG4gICAgICAgIHsuLi5vYmplY3R9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIG5vZGVSZWY9e3RoaXMub2JqZWN0UmVmc1tpbmRleF19XG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLm9uTW91c2VPdmVyKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMub25Nb3VzZURvd24oaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRyYWdSZWN0ID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICB7Li4udGhpcy5zdGF0ZS5kcmFnUmVjdH1cbiAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHN0cm9rZTogJyM0Mjg1ZjQnLFxuICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICBzdHJva2VXaWR0aDogJzJweCdcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIGFkZCB0byBzZWxlY3Rpb25cbiAgICAgIC8vIHBvc3NpYmx5LCBkaXNzYWxvdyBzZWxlY3RpbmcgYW5vdGhlciB0eXBlXG4gICAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNhbWVUeXBlID0gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgICAgcmV0dXJuIHNhbWVUeXBlID8gb2JqZWN0cy5hZGQoaW5kZXgpIDogb2JqZWN0cztcbiAgICB9XG4gIH1cblxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0RHJhZyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ0luaXRpYXRlZDogdHJ1ZSxcbiAgICAgIGRyYWdPcmlnaW46IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRHJhZyA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHsgZHJhZ0luaXRpYXRlZCwgZHJhZ09yaWdpbiB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgeyBkcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChkcmFnSW5pdGlhdGVkICYmICFkcmFnZ2luZykge1xuICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgZHJhZ1JlY3Q6IHtcbiAgICAgICAgICB4OiBNYXRoLm1pbihjdXJyZW50LngsIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgeTogTWF0aC5taW4oY3VycmVudC55LCBkcmFnT3JpZ2luLnkpLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhjdXJyZW50LnggLSBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoY3VycmVudC55IC0gZHJhZ09yaWdpbi55KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVybGFwcyhhLCBiLCB4LCB5KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGEsIHgpIDwgTWF0aC5taW4oYiwgeSk7XG4gIH1cblxuICBib3hPdmVybGFwKGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcy5vdmVybGFwcyhhLmxlZnQsIGEucmlnaHQsIGIubGVmdCwgYi5yaWdodCkgJiYgXG4gICAgICAgICAgIHRoaXMub3ZlcmxhcHMoYS50b3AsIGEuYm90dG9tLCBiLnRvcCwgYi5ib3R0b20pXG4gIH1cblxuICByZWN0VG9Cb3ggPSAocmVjdCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiByZWN0LngsXG4gICAgICByaWdodDogcmVjdC54ICsgcmVjdC53aWR0aCxcbiAgICAgIHRvcDogcmVjdC55LFxuICAgICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICAgIH07XG4gIH1cblxuICBzdG9wRHJhZyA9IChldmVudCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmRyYWdnaW5nKSB7XG4gICAgICBjb25zdCBpbmRpY2VzID0gdGhpcy5wcm9wcy5vYmplY3RzLm1hcCgob2JqZWN0LCBpbmRleCkgPT4gaW5kZXgpO1xuICAgICAgY29uc3QgdG9TZWxlY3QgPSBpbmRpY2VzLmZpbHRlcihpbmRleCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmJveE92ZXJsYXAoXG4gICAgICAgICAgdGhpcy5yZWN0VG9Cb3godGhpcy5zdGF0ZS5kcmFnUmVjdCksXG4gICAgICAgICAgdGhpcy5yZWN0VG9Cb3godGhpcy5nZXRCQm94KGluZGV4KSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWxlY3RPYmplY3RzKHRvU2VsZWN0KTtcbiAgICB9IFxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBkcmFnSW5pdGlhdGVkOiBmYWxzZSxcbiAgICAgIGRyYWdSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcHV0ZUNvb3JkaW5hdGVzKG1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBkaW0gPSB0aGlzLnN2Z1JlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1vdXNlRXZlbnQuY2xpZW50WCAtIGRpbS5sZWZ0LFxuICAgICAgeTogbW91c2VFdmVudC5jbGllbnRZIC0gZGltLnRvcFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBjdXJyZW50bHlIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBkcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZE9iamVjdHNBcnJheSA9IFsuLi5zZWxlY3RlZE9iamVjdHNdOyAvLyBDb252ZXJ0IFNldCB0byBBcnJheVxuICAgIGNvbnN0IHJlbmRlckhvdmVyID0gdGhpcy5zaG91bGRSZW5kZXJIb3ZlcihjdXJyZW50bHlIb3ZlcmluZyk7XG4gICAgY29uc3QgaG90S2V5U3R5bGUgPSB7XG4gICAgICB3aWR0aCxcbiAgICAgIG91dGxpbmU6IDBcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlzXG4gICAgICAgIHN0eWxlPXtob3RLZXlTdHlsZX1cbiAgICAgICAga2V5TWFwPXt0aGlzLm1hcH1cbiAgICAgICAgaGFuZGxlcnM9e3RoaXMuaGFuZGxlcnN9XG4gICAgICAgIGZvY3VzZWRcbiAgICAgICAgYXR0YWNoPXt3aW5kb3d9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZXZ0KSA9PiBldnQucHJldmVudERlZmF1bHQoKX1cbiAgICAgID5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHJlZj17dGhpcy5zdmdSZWZ9XG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXtzdHlsZXN9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuc3RhcnREcmFnfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZURyYWd9XG4gICAgICAgICAgb25Nb3VzZVVwPXt0aGlzLnN0b3BEcmFnfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyU3VyZmFjZSgpfVxuXG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cblxuICAgICAgICAgIHtyZW5kZXJIb3ZlciAmJiAhZHJhZ2dpbmcgJiYgKFxuICAgICAgICAgICAgPEhvdmVyUmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KGN1cnJlbnRseUhvdmVyaW5nKX1cbiAgICAgICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLm9uTW91c2VMZWF2ZX0gIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KG9iamVjdEluZGV4KX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24ob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG5cbiAgICAgICAgICB7ZHJhZ2dpbmcgJiYgdGhpcy5yZW5kZXJEcmFnUmVjdCgpfVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvSG90S2V5cz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzdHlsZXMgPSB7XG4gIGJhY2tncm91bmRJbWFnZTogJ3VybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1J1xuICAgICsgJ3ZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwUFNJeU1DSStDanh5WldOMElIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMCdcbiAgICArICdQU0l5TUNJZ1ptbHNiRDBpSTJabVppSStQQzl5WldOMFBnbzhjbVZqZENCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJR1pwYkd3OUknXG4gICAgKyAnaU5HTjBZM1JqY2lQand2Y21WamRENEtQSEpsWTNRZ2VEMGlNVEFpSUhrOUlqRXdJaUIzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHJ1xuICAgICsgJ1pwYkd3OUlpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BDOXpkbWMrKScsXG4gIGJhY2tncm91bmRTaXplOiAnYXV0bydcbn07XG4iXX0=