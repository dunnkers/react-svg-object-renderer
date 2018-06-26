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
  } // offsetCoordinateSpace(ref) {
  //   return {
  //     x: mouseEvent.clientX - dim.left,
  //     y: mouseEvent.clientY - dim.top
  //   }
  // }


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsInNldFN0YXRlIiwiaW5kZXhlcyIsInN0YXRlIiwiY2xlYXIiLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0UmVmcyIsImN1cnJlbnQiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsImNvbXB1dGVDb29yZGluYXRlcyIsIk1hdGgiLCJtaW4iLCJhYnMiLCJyZWN0IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwiaW5kaWNlcyIsIm1hcCIsInRvU2VsZWN0IiwiZmlsdGVyIiwiYm94T3ZlcmxhcCIsInJlY3RUb0JveCIsInNlbGVjdE9iamVjdHMiLCJPYmplY3QiLCJlbnRyaWVzIiwic3ZnUmVmIiwiZGVsZXRlIiwic2FtZVR5cGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJvdmVybGFwcyIsImEiLCJiIiwibWF4IiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwicmVuZGVyIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJyZW5kZXJIb3ZlciIsInNob3VsZFJlbmRlckhvdmVyIiwiaG90S2V5U3R5bGUiLCJvdXRsaW5lIiwiaGFuZGxlcnMiLCJ3aW5kb3ciLCJldnQiLCJzdHlsZXMiLCJzdGFydERyYWciLCJoYW5kbGVEcmFnIiwic3RvcERyYWciLCJyZW5kZXJTdXJmYWNlIiwicmVuZGVyT2JqZWN0Iiwib2JqZWN0SW5kZXgiLCJyZW5kZXJEcmFnUmVjdCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RPZiIsImZ1bmMiLCJib29sIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixFQUEyQkMsU0FBM0IsUUFBNEMsT0FBNUM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsU0FBU0MsT0FBVCxRQUF3QixlQUF4QjtBQUVBLE9BQU9DLFNBQVAsTUFBc0IsYUFBdEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCO0FBRUEsZUFBZSxNQUFNQyxpQkFBTixTQUFnQ04sU0FBaEMsQ0FBMEM7QUFnQ3ZETyxjQUFZQyxLQUFaLEVBQW1CO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLG1DQVhYO0FBQ05DLGtCQUFZLEtBRE47QUFFTkMseUJBQW1CLElBRmI7QUFHTkMsdUJBQWlCLElBQUlDLEdBQUosRUFIWDtBQUlOQyxtQkFBYSxLQUpQO0FBS05DLG9CQUFjLElBTFI7QUFNTkMsZ0JBQVUsS0FOSjtBQU9OQyxrQkFBWTtBQUFFQyxXQUFHLENBQUw7QUFBUUMsV0FB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QUFGbEIsT0FkSixFQW9CR3FDLHFCQUFxQnZCLEdBQXJCLENBQXlCLENBQUNxQyxXQUFELEVBQWNoRixLQUFkLEtBQ3hCLG9CQUFDLFVBQUQsZUFDTSxLQUFLYSxPQUFMLENBQWFtRSxXQUFiLENBRE47QUFFRSxXQUFLaEYsS0FGUDtBQUdFLGNBQVNRLEtBQUQsSUFBVyxLQUFLb0IsV0FBTCxDQUFpQm9ELFdBQWpCLEVBQThCeEUsS0FBOUI7QUFIckIsT0FERCxDQXBCSCxFQTRCR2YsWUFBWSxLQUFLd0YsY0FBTCxFQTVCZixDQVJGLENBREY7QUF5Q0Q7O0FBM1RzRDs7Z0JBQXBDakcsaUIsZUFDQTtBQUNqQmMsU0FBT2xCLFVBQVVzRyxNQURBO0FBRWpCbkYsVUFBUW5CLFVBQVVzRyxNQUZEO0FBR2pCaEUsV0FBU3RDLFVBQVV1RyxPQUFWLENBQWtCdkcsVUFBVXdHLEtBQVYsQ0FBZ0I7QUFDekNqRSxVQUFNdkMsVUFBVXlHLE1BQVYsQ0FBaUJDO0FBRGtCLEdBQWhCLENBQWxCLENBSFE7QUFNakI3RCxlQUFhN0MsVUFBVTJHLFFBQVYsQ0FBbUIzRyxVQUFVNEcsSUFBN0IsQ0FOSTtBQU9qQm5GLHFCQUFtQnpCLFVBQVU0RyxJQVBaO0FBUWpCcEUseUJBQXVCeEMsVUFBVTZHO0FBUmhCLEM7O2dCQURBekcsaUIsa0JBWUc7QUFDcEJjLFNBQU8sR0FEYTtBQUVwQkMsVUFBUSxHQUZZO0FBR3BCbUIsV0FBUyxFQUhXO0FBSXBCTyxlQUFhLEVBSk87QUFLcEJwQixxQkFBbUIsTUFBTSxDQUFFLENBTFA7QUFNcEJlLHlCQUF1QjtBQU5ILEM7O0FBa1R4QixPQUFPLE1BQU1zRCxTQUFTO0FBQ3BCZ0IsbUJBQWlCLHNFQUNiLG1GQURhLEdBRWIsbUZBRmEsR0FHYixtRkFIYSxHQUliLHlDQUxnQjtBQU1wQkMsa0JBQWdCO0FBTkksQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBIb3RLZXlzIH0gZnJvbSAncmVhY3QtaG90a2V5cyc7XG5cbmltcG9ydCBIb3ZlclJlY3QgZnJvbSAnLi9Ib3ZlclJlY3QnO1xuaW1wb3J0IFNlbGVjdFJlY3QgZnJvbSAnLi9TZWxlY3RSZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT2JqZWN0UmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvYmplY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIG9iamVjdFR5cGVzOiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmZ1bmMpLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IFByb3BUeXBlcy5ib29sXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiA0MDAsXG4gICAgb2JqZWN0czogW10sXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IGZhbHNlXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBpc0hvdmVyaW5nOiBmYWxzZSxcbiAgICBjdXJyZW50bHlIb3ZlcmluZzogbnVsbCxcbiAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKSxcbiAgICBtdWx0aVNlbGVjdDogZmFsc2UsXG4gICAgc2VsZWN0ZWRUeXBlOiBudWxsLFxuICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICBkcmFnT3JpZ2luOiB7IHg6IDAsIHk6IDAgfSxcbiAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub2JqZWN0UmVmcyA9IE9iamVjdC5lbnRyaWVzKHByb3BzLm9iamVjdHMpLm1hcCgoKSA9PiBjcmVhdGVSZWYoKSk7XG4gICAgdGhpcy5zdmdSZWYgPSBjcmVhdGVSZWYoKTtcbiAgfVxuXG4gIG9uTW91c2VPdmVyID0gKGluZGV4KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IHRydWUsIGN1cnJlbnRseUhvdmVyaW5nOiBpbmRleCB9KTtcbiAgfVxuXG4gIG9uTW91c2VMZWF2ZSA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiBmYWxzZSB9KVxuXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRleGVzID0+IHtcbiAgICB0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5jbGVhcigpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoaW5kZXhlcykgfSk7XG5cbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gIH1cblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleClcbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMpKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5jdXJyZW50LmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IHRydWUgfSksXG4gICAgbXVsdGlTZWxlY3RPZmY6ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogZmFsc2UgfSlcbiAgfTtcblxuICBtYXAgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXlkb3duJyB9LFxuICAgIG11bHRpU2VsZWN0T2ZmOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleXVwJyB9XG4gIH07XG5cbiAgaXNTZWxlY3RlZFR5cGUgPSAoaW5kZXgpID0+XG4gICAgdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkVHlwZTtcblxuICBzaG91bGRSZW5kZXJIb3ZlciA9IChpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgaXNIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKCFpc0hvdmVyaW5nIHx8IHNlbGVjdGVkT2JqZWN0cy5oYXMoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW5kZXJTdXJmYWNlID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICBvcGFjaXR5PVwiMC4wXCJcbiAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXG4gICAgICAgIG9uTW91c2VEb3duPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMpKTtcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBub2RlUmVmPXt0aGlzLm9iamVjdFJlZnNbaW5kZXhdfVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5vbk1vdXNlT3ZlcihpbmRleCl9XG4gICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm9uTW91c2VEb3duKGluZGV4LCBldmVudCl9XG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5vbk1vdXNlTGVhdmV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEcmFnUmVjdCA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgey4uLnRoaXMuc3RhdGUuZHJhZ1JlY3R9XG4gICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBzdHJva2U6ICcjNDI4NWY0JyxcbiAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6ICcycHgnXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBtdWx0aVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXG4gICAgICBvYmplY3RzLmRlbGV0ZShpbmRleCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBhZGQgdG8gc2VsZWN0aW9uXG4gICAgICAvLyBwb3NzaWJseSwgZGlzc2Fsb3cgc2VsZWN0aW5nIGFub3RoZXIgdHlwZVxuICAgICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBzYW1lVHlwZSA9IHRoaXMuaXNTZWxlY3RlZFR5cGUoaW5kZXgpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbjtcbiAgICAgIHJldHVybiBzYW1lVHlwZSA/IG9iamVjdHMuYWRkKGluZGV4KSA6IG9iamVjdHM7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyBkZXNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlU2VsZWN0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKG11bHRpU2VsZWN0ICYmIHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmdsZVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9XG4gIH1cblxuICBzdGFydERyYWcgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdnaW5nOiB0cnVlLFxuICAgICAgZHJhZ09yaWdpbjogdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IHsgZHJhZ09yaWdpbiB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ1JlY3Q6IHtcbiAgICAgICAgICB4OiBNYXRoLm1pbihjdXJyZW50LngsIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgeTogTWF0aC5taW4oY3VycmVudC55LCBkcmFnT3JpZ2luLnkpLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhjdXJyZW50LnggLSBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoY3VycmVudC55IC0gZHJhZ09yaWdpbi55KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvdmVybGFwcyhhLCBiLCB4LCB5KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGEsIHgpIDwgTWF0aC5taW4oYiwgeSk7XG4gIH1cblxuICBib3hPdmVybGFwKGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcy5vdmVybGFwcyhhLmxlZnQsIGEucmlnaHQsIGIubGVmdCwgYi5yaWdodCkgJiYgXG4gICAgICAgICAgIHRoaXMub3ZlcmxhcHMoYS50b3AsIGEuYm90dG9tLCBiLnRvcCwgYi5ib3R0b20pXG4gIH1cblxuICByZWN0VG9Cb3ggPSAocmVjdCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiByZWN0LngsXG4gICAgICByaWdodDogcmVjdC54ICsgcmVjdC53aWR0aCxcbiAgICAgIHRvcDogcmVjdC55LFxuICAgICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICAgIH07XG4gIH1cblxuICBzdG9wRHJhZyA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHsgZHJhZ1JlY3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgaW5kaWNlcyA9IHRoaXMucHJvcHMub2JqZWN0cy5tYXAoKG9iamVjdCwgaW5kZXgpID0+IGluZGV4KTtcbiAgICBjb25zdCB0b1NlbGVjdCA9IGluZGljZXMuZmlsdGVyKGluZGV4ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmJveE92ZXJsYXAoXG4gICAgICAgIHRoaXMucmVjdFRvQm94KGRyYWdSZWN0KSxcbiAgICAgICAgdGhpcy5yZWN0VG9Cb3godGhpcy5nZXRCQm94KGluZGV4KSlcbiAgICAgICk7XG4gICAgfSk7XG4gICAgdGhpcy5zZWxlY3RPYmplY3RzKHRvU2VsZWN0KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZ1JlY3Q6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wdXRlQ29vcmRpbmF0ZXMobW91c2VFdmVudCkge1xuICAgIGNvbnN0IGRpbSA9IHRoaXMuc3ZnUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogbW91c2VFdmVudC5jbGllbnRYIC0gZGltLmxlZnQsXG4gICAgICB5OiBtb3VzZUV2ZW50LmNsaWVudFkgLSBkaW0udG9wXG4gICAgfVxuICB9XG5cbiAgLy8gb2Zmc2V0Q29vcmRpbmF0ZVNwYWNlKHJlZikge1xuXG5cbiAgLy8gICByZXR1cm4ge1xuICAvLyAgICAgeDogbW91c2VFdmVudC5jbGllbnRYIC0gZGltLmxlZnQsXG4gIC8vICAgICB5OiBtb3VzZUV2ZW50LmNsaWVudFkgLSBkaW0udG9wXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMsIGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XG4gICAgY29uc3QgcmVuZGVySG92ZXIgPSB0aGlzLnNob3VsZFJlbmRlckhvdmVyKGN1cnJlbnRseUhvdmVyaW5nKTtcbiAgICBjb25zdCBob3RLZXlTdHlsZSA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgb3V0bGluZTogMFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleXNcbiAgICAgICAgc3R5bGU9e2hvdEtleVN0eWxlfVxuICAgICAgICBrZXlNYXA9e3RoaXMubWFwfVxuICAgICAgICBoYW5kbGVycz17dGhpcy5oYW5kbGVyc31cbiAgICAgICAgZm9jdXNlZFxuICAgICAgICBhdHRhY2g9e3dpbmRvd31cbiAgICAgICAgb25Nb3VzZURvd249eyhldnQpID0+IGV2dC5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgcmVmPXt0aGlzLnN2Z1JlZn1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlc31cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zdGFydERyYWd9XG4gICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuaGFuZGxlRHJhZ31cbiAgICAgICAgICBvbk1vdXNlVXA9e3RoaXMuc3RvcERyYWd9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTdXJmYWNlKCl9XG5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3JlbmRlckhvdmVyICYmICFkcmFnZ2luZyAmJiAoXG4gICAgICAgICAgICA8SG92ZXJSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3goY3VycmVudGx5SG92ZXJpbmcpfVxuICAgICAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMub25Nb3VzZUxlYXZlfSAgXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3gob2JqZWN0SW5kZXgpfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cblxuICAgICAgICAgIHtkcmFnZ2luZyAmJiB0aGlzLnJlbmRlckRyYWdSZWN0KCl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9Ib3RLZXlzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOiAndXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTUnXG4gICAgKyAndmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDBQU0l5TUNJK0NqeHlaV04wSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwJ1xuICAgICsgJ1BTSXlNQ0lnWm1sc2JEMGlJMlptWmlJK1BDOXlaV04wUGdvOGNtVmpkQ0IzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHWnBiR3c5SSdcbiAgICArICdpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BISmxZM1FnZUQwaU1UQWlJSGs5SWpFd0lpQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUcnXG4gICAgKyAnWnBiR3c5SWlOR04wWTNSamNpUGp3dmNtVmpkRDRLUEM5emRtYyspJyxcbiAgYmFja2dyb3VuZFNpemU6ICdhdXRvJ1xufTtcbiJdfQ==