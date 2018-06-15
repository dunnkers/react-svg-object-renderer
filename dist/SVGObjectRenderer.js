function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
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

    _defineProperty(this, "onMouseDown", (index, event) => {
      event.preventDefault(); // 💡 Prevents user selecting any svg text

      this.setState({
        selectedObjects: this.computeSelection(index)
      }); // notify outside world of selection change. convert set to array.

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

    this.objectRefs = {};
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
    return React.createElement(HotKeys, {
      keyMap: this.map,
      handlers: this.handlers,
      focused: true,
      attach: window
    }, React.createElement("svg", {
      width: width,
      height: height,
      style: styles
    }, objects.map(this.renderObject), renderHover && React.createElement(HoverRect, _extends({}, this.getBBox(currentlyHovering), {
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

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIm9iamVjdFJlZnMiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50IiwicmVmIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJyZW5kZXIiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJtYXAiLCJoYW5kbGVycyIsIndpbmRvdyIsInN0eWxlcyIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJi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VyxLQUFLb0M7QUFGbEIsT0FKSixFQVVHTyxxQkFBcUJHLEdBQXJCLENBQXlCLENBQUNLLFdBQUQsRUFBYzlDLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNLEtBQUtjLE9BQUwsQ0FBYWdDLFdBQWIsQ0FETjtBQUVFLFdBQUs5QyxLQUZQO0FBR0UsY0FBU0UsS0FBRCxJQUFXLEtBQUs0QixXQUFMLENBQWlCZ0IsV0FBakIsRUFBOEI1QyxLQUE5QjtBQUhyQixPQURELENBVkgsQ0FERixDQURGO0FBc0JEOztBQTlLc0Q7O2dCQUFwQ1gsaUIsZUFDQTtBQUNqQm9CLFNBQU94QixVQUFVNEQsTUFEQTtBQUVqQm5DLFVBQVF6QixVQUFVNEQsTUFGRDtBQUdqQjVCLFdBQVNoQyxVQUFVNkQsT0FBVixDQUFrQjdELFVBQVU4RCxLQUFWLENBQWdCO0FBQ3pDN0IsVUFBTWpDLFVBQVUrRCxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCekIsZUFBYXZDLFVBQVVpRSxRQUFWLENBQW1CakUsVUFBVWtFLElBQTdCLENBTkk7QUFPakJoRCxxQkFBbUJsQixVQUFVa0UsSUFQWjtBQVFqQmhDLHlCQUF1QmxDLFVBQVVtRTtBQVJoQixDOztnQkFEQS9ELGlCLGtCQVlHO0FBQ3BCb0IsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJPLFdBQVMsRUFIVztBQUlwQk8sZUFBYSxFQUpPO0FBS3BCckIscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCZ0IseUJBQXVCO0FBTkgsQzs7QUFxS3hCLE9BQU8sTUFBTXVCLFNBQVM7QUFDcEJXLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2xcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDQwMCxcbiAgICBoZWlnaHQ6IDQwMCxcbiAgICBvYmplY3RzOiBbXSxcbiAgICBvYmplY3RUeXBlczoge30sXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogZmFsc2VcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGlzSG92ZXJpbmc6IGZhbHNlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBudWxsLFxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgICBzZWxlY3RlZFR5cGU6IG51bGxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub2JqZWN0UmVmcyA9IHt9O1xuICB9XG5cbiAgb25Nb3VzZU92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogdHJ1ZSwgY3VycmVudGx5SG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzSG92ZXJpbmc6IGZhbHNlIH0pXG5cbiAgb25Nb3VzZURvd24gPSAoaW5kZXgsIGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8g8J+SoSBQcmV2ZW50cyB1c2VyIHNlbGVjdGluZyBhbnkgc3ZnIHRleHRcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiB0aGlzLmNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpXG4gICAgfSk7XG5cbiAgICAvLyBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMpKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5nZXRCQm94KCk7XG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgaGFuZGxlcnMgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiB0cnVlIH0pLFxuICAgIG11bHRpU2VsZWN0T2ZmOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IGZhbHNlIH0pXG4gIH07XG5cbiAgbWFwID0ge1xuICAgIG11bHRpU2VsZWN0T246IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5ZG93bicgfSxcbiAgICBtdWx0aVNlbGVjdE9mZjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXl1cCcgfVxuICB9O1xuXG4gIGlzU2VsZWN0ZWRUeXBlID0gKGluZGV4KSA9PlxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XG5cbiAgc2hvdWxkUmVuZGVySG92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IGlzSG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxuICAgIGlmICghaXNIb3ZlcmluZyB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGluZGV4KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBzZWxlY3Rpbmcgb2JqZWN0cyBvZiBzYW1lIHR5cGVcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVuZGVyT2JqZWN0ID0gKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IE9iamVjdENvbXBvbmVudCA9IG9iamVjdFR5cGVzW29iamVjdC50eXBlXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8T2JqZWN0Q29tcG9uZW50XG4gICAgICAgIHsuLi5vYmplY3R9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIHJlZkNhbGxiYWNrPXtyZWYgPT4ge1xuICAgICAgICAgIHRoaXMub2JqZWN0UmVmc1tpbmRleF0gPSByZWY7XG4gICAgICAgIH19IC8vIPCfkqEgV2Ugc2hvdWxkIHVzZSBgY3JlYXRlUmVmYCBmcm9tIFJlYWN0IF52MTYueCBvbndhcmRzIGluc3RlYWQuXG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLm9uTW91c2VPdmVyKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMub25Nb3VzZURvd24oaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIGFkZCB0byBzZWxlY3Rpb25cbiAgICAgIC8vIHBvc3NpYmx5LCBkaXNzYWxvdyBzZWxlY3RpbmcgYW5vdGhlciB0eXBlXG4gICAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNhbWVUeXBlID0gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgICAgcmV0dXJuIHNhbWVUeXBlID8gb2JqZWN0cy5hZGQoaW5kZXgpIDogb2JqZWN0cztcbiAgICB9XG4gIH1cblxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBjdXJyZW50bHlIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XG4gICAgY29uc3QgcmVuZGVySG92ZXIgPSB0aGlzLnNob3VsZFJlbmRlckhvdmVyKGN1cnJlbnRseUhvdmVyaW5nKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5cyBrZXlNYXA9e3RoaXMubWFwfSBoYW5kbGVycz17dGhpcy5oYW5kbGVyc30gZm9jdXNlZCBhdHRhY2g9e3dpbmRvd30+XG4gICAgICAgIDxzdmcgd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0gc3R5bGU9e3N0eWxlc30gPlxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7cmVuZGVySG92ZXIgJiYgKFxuICAgICAgICAgICAgPEhvdmVyUmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KGN1cnJlbnRseUhvdmVyaW5nKX1cbiAgICAgICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLm9uTW91c2VMZWF2ZX0gIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRCQm94KG9iamVjdEluZGV4KX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24ob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9Ib3RLZXlzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOiAndXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTUnXG4gICAgKyAndmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDBQU0l5TUNJK0NqeHlaV04wSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwJ1xuICAgICsgJ1BTSXlNQ0lnWm1sc2JEMGlJMlptWmlJK1BDOXlaV04wUGdvOGNtVmpkQ0IzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHWnBiR3c5SSdcbiAgICArICdpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BISmxZM1FnZUQwaU1UQWlJSGs5SWpFd0lpQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUcnXG4gICAgKyAnWnBiR3c5SWlOR04wWTNSamNpUGp3dmNtVmpkRDRLUEM5emRtYyspJyxcbiAgYmFja2dyb3VuZFNpemU6ICdhdXRvJ1xufTtcbiJdfQ==