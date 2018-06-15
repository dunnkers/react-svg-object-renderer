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
      multiSelect: false
    });

    _defineProperty(this, "onMouseOver", index => this.setState({
      isHovering: true,
      currentlyHovering: index
    }));

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
      objects.delete(index);
      return objects;
    } else {
      return objects.add(index);
    }
  }

  singleSelect(index, objects) {
    const hasSelection = objects.has(index);
    objects.clear();
    return hasSelection ? objects : objects.add(index);
  }

  computeSelection(index) {
    if (this.state.multiSelect) {
      return this.multiSelect(index, this.state.selectedObjects);
    } else {
      return this.singleSelect(index, this.state.selectedObjects);
    }
  }

  render() {
    const {
      width,
      height,
      objects
    } = this.props;
    const {
      isHovering,
      currentlyHovering,
      selectedObjects
    } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    const renderHover = isHovering && !this.state.selectedObjects.has(currentlyHovering);
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
  onSelectionChange: PropTypes.func
});

_defineProperty(SVGObjectRenderer, "defaultProps", {
  width: 400,
  height: 400,
  objects: [],
  objectTypes: {},
  onSelectionChange: () => {}
});

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIm9iamVjdFJlZnMiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3QiLCJvYmplY3RUeXBlcyIsIk9iamVjdENvbXBvbmVudCIsInR5cGUiLCJyZWYiLCJvbk1vdXNlT3ZlciIsIm9uTW91c2VEb3duIiwib25Nb3VzZUxlYXZlIiwib2JqZWN0cyIsImhhcyIsImRlbGV0ZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImhhc1NlbGVjdGlvbiIsImNsZWFyIiwicmVuZGVyIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJyZW5kZXJIb3ZlciIsIm1hcCIsImhhbmRsZXJzIiwid2luZG93Iiwic3R5bGVzIiwicmVuZGVyT2JqZWN0Iiwib2JqZWN0SW5kZXgiLCJudW1iZXIiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0T2YiLCJmdW5jIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNB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LE9BQUwsQ0FBYWxCLGlCQUFiLENBRE47QUFFRSxpQkFBVyxLQUFLOEI7QUFGbEIsT0FKSixFQVVHUyxxQkFBcUJFLEdBQXJCLENBQXlCLENBQUNLLFdBQUQsRUFBYzFDLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNLEtBQUtjLE9BQUwsQ0FBYTRCLFdBQWIsQ0FETjtBQUVFLFdBQUsxQyxLQUZQO0FBR0UsY0FBU0UsS0FBRCxJQUFXLEtBQUt1QixXQUFMLENBQWlCaUIsV0FBakIsRUFBOEJ4QyxLQUE5QjtBQUhyQixPQURELENBVkgsQ0FERixDQURGO0FBc0JEOztBQTlJc0Q7O2dCQUFwQ1YsaUIsZUFDQTtBQUNqQm1CLFNBQU92QixVQUFVdUQsTUFEQTtBQUVqQi9CLFVBQVF4QixVQUFVdUQsTUFGRDtBQUdqQmhCLFdBQVN2QyxVQUFVd0QsT0FBVixDQUFrQnhELFVBQVV5RCxLQUFWLENBQWdCO0FBQ3pDdkIsVUFBTWxDLFVBQVUwRCxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCM0IsZUFBYWhDLFVBQVU0RCxRQUFWLENBQW1CNUQsVUFBVTZELElBQTdCLENBTkk7QUFPakI1QyxxQkFBbUJqQixVQUFVNkQ7QUFQWixDOztnQkFEQXpELGlCLGtCQVdHO0FBQ3BCbUIsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJlLFdBQVMsRUFIVztBQUlwQlAsZUFBYSxFQUpPO0FBS3BCZixxQkFBbUIsTUFBTSxDQUFFO0FBTFAsQzs7QUFzSXhCLE9BQU8sTUFBTW1DLFNBQVM7QUFDcEJVLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiA0MDAsXG4gICAgb2JqZWN0czogW10sXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7fVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9iamVjdFJlZnMgPSB7fTtcbiAgfVxuXG4gIG9uTW91c2VPdmVyID0gKGluZGV4KSA9PiB0aGlzLnNldFN0YXRlKHtcbiAgICBpc0hvdmVyaW5nOiB0cnVlLFxuICAgIGN1cnJlbnRseUhvdmVyaW5nOiBpbmRleFxuICB9KTtcblxuICBvbk1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogZmFsc2UgfSlcblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleClcbiAgICB9KTtcblxuICAgIC8vIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICB9XG5cbiAgLyog4pqgXG4gICAgKiBnZXRCQm94KCkgbWlnaHQgaGF2ZSBpbnN1ZmZpY2llbnQgYnJvd3NlciBzdXBwb3J0IVxuICAgICogVGhlIGZ1bmN0aW9uIGhhcyBsaXR0bGUgZG9jdW1lbnRhdGlvbi4gSW4gY2FzZSB1c2Ugb2YgQkJveCB0dXJucyBvdXRcbiAgICAqIHByb2JsZW1hdGljLCBjb25zaWRlciB1c2luZyBgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBhbG9uZyB3aXRoXG4gICAgKiAkKCc8c3ZnPicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHRvIGNvcnJlY3QgdGhlIHggYW5kIHkgb2Zmc2V0LlxuICAgICovXG4gIGdldEJCb3ggPSAoaW5kZXgpID0+IHtcbiAgICAvLyBkZXN0cnVjdCBhbmQgY29uc3RydWN0OyAgZ2V0QkJveCByZXR1cm5zIGEgU1ZHUmVjdCB3aGljaCBkb2VzIG5vdCBzcHJlYWQuXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLm9iamVjdFJlZnNbaW5kZXhdLmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IHRydWUgfSksXG4gICAgbXVsdGlTZWxlY3RPZmY6ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogZmFsc2UgfSlcbiAgfTtcblxuICBtYXAgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXlkb3duJyB9LFxuICAgIG11bHRpU2VsZWN0T2ZmOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleXVwJyB9XG4gIH07XG5cbiAgcmVuZGVyT2JqZWN0ID0gKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IE9iamVjdENvbXBvbmVudCA9IG9iamVjdFR5cGVzW29iamVjdC50eXBlXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8T2JqZWN0Q29tcG9uZW50XG4gICAgICAgIHsuLi5vYmplY3R9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIHJlZkNhbGxiYWNrPXtyZWYgPT4ge1xuICAgICAgICAgIHRoaXMub2JqZWN0UmVmc1tpbmRleF0gPSByZWY7XG4gICAgICAgIH19IC8vIPCfkqEgV2Ugc2hvdWxkIHVzZSBgY3JlYXRlUmVmYCBmcm9tIFJlYWN0IF52MTYueCBvbndhcmRzIGluc3RlYWQuXG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLm9uTW91c2VPdmVyKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMub25Nb3VzZURvd24oaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkge1xuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgY29uc3QgaGFzU2VsZWN0aW9uID0gb2JqZWN0cy5oYXMoaW5kZXgpO1xuICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICByZXR1cm4gaGFzU2VsZWN0aW9uID8gb2JqZWN0cyA6IG9iamVjdHMuYWRkKGluZGV4KTtcbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tdWx0aVNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCB0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGlzSG92ZXJpbmcsIGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcblxuICAgIGNvbnN0IHJlbmRlckhvdmVyID0gaXNIb3ZlcmluZyAmJiBcbiAgICAgICF0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5oYXMoY3VycmVudGx5SG92ZXJpbmcpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlzIGtleU1hcD17dGhpcy5tYXB9IGhhbmRsZXJzPXt0aGlzLmhhbmRsZXJzfSBmb2N1c2VkIGF0dGFjaD17d2luZG93fT5cbiAgICAgICAgPHN2ZyB3aWR0aD17d2lkdGh9IGhlaWdodD17aGVpZ2h0fSBzdHlsZT17c3R5bGVzfSA+XG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cblxuICAgICAgICAgIHtyZW5kZXJIb3ZlciAmJiAoXG4gICAgICAgICAgICA8SG92ZXJSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3goY3VycmVudGx5SG92ZXJpbmcpfVxuICAgICAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMub25Nb3VzZUxlYXZlfSAgXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3gob2JqZWN0SW5kZXgpfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L0hvdEtleXM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NSdcbiAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICsgJ2lOR04wWTNSamNpUGp3dmNtVmpkRDRLUEhKbFkzUWdlRDBpTVRBaUlIazlJakV3SWlCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJRydcbiAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG59O1xuIl19