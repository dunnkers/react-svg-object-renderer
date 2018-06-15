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
      } = this.state; // don't render when object already selected

      if (!isHovering || selectedObjects.has(index)) {
        return false;
      } // don't render when selecting objects of same type


      if (selectedObjects.size > 0 && multiSelect) {
        return this.isSelectedType(index);
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
      const sameType = this.isSelectedType(index);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIm9iamVjdFJlZnMiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50IiwicmVmIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJyZW5kZXIiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJtYXAiLCJoYW5kbGVycyIsIndpbmRvdyIsInN0eWxlcyIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRTaXplIl0sIm1hcHBpbmdzIjoiOzs7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LEtBRlA7QUFHRSxjQUFTRSxLQUFELElBQVcsS0FBSzJCLFdBQUwsQ0FBaUJnQixXQUFqQixFQUE4QjNDLEtBQTlCO0FBSHJCLE9BREQsQ0FWSCxDQURGLENBREY7QUFzQkQ7O0FBMUtzRDs7Z0JBQXBDWCxpQixlQUNBO0FBQ2pCb0IsU0FBT3hCLFVBQVUyRCxNQURBO0FBRWpCbEMsVUFBUXpCLFVBQVUyRCxNQUZEO0FBR2pCM0IsV0FBU2hDLFVBQVU0RCxPQUFWLENBQWtCNUQsVUFBVTZELEtBQVYsQ0FBZ0I7QUFDekM1QixVQUFNakMsVUFBVThELE1BQVYsQ0FBaUJDO0FBRGtCLEdBQWhCLENBQWxCLENBSFE7QUFNakJ6QixlQUFhdEMsVUFBVWdFLFFBQVYsQ0FBbUJoRSxVQUFVaUUsSUFBN0IsQ0FOSTtBQU9qQi9DLHFCQUFtQmxCLFVBQVVpRTtBQVBaLEM7O2dCQURBN0QsaUIsa0JBV0c7QUFDcEJvQixTQUFPLEdBRGE7QUFFcEJDLFVBQVEsR0FGWTtBQUdwQk8sV0FBUyxFQUhXO0FBSXBCTSxlQUFhLEVBSk87QUFLcEJwQixxQkFBbUIsTUFBTSxDQUFFO0FBTFAsQzs7QUFrS3hCLE9BQU8sTUFBTXNDLFNBQVM7QUFDcEJVLG1CQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMZ0I7QUFNcEJDLGtCQUFnQjtBQU5JLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEhvdEtleXMgfSBmcm9tICdyZWFjdC1ob3RrZXlzJztcblxuaW1wb3J0IEhvdmVyUmVjdCBmcm9tICcuL0hvdmVyUmVjdCc7XG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL1NlbGVjdFJlY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdPYmplY3RSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiA0MDAsXG4gICAgb2JqZWN0czogW10sXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7fVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0ge307XG4gIH1cblxuICBvbk1vdXNlT3ZlciA9IChpbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiB0cnVlLCBjdXJyZW50bHlIb3ZlcmluZzogaW5kZXggfSk7XG4gIH1cblxuICBvbk1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogZmFsc2UgfSlcblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleClcbiAgICB9KTtcblxuICAgIC8vIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb25DaGFuZ2UoQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cykpO1xuICB9XG5cbiAgLyog4pqgXG4gICAgKiBnZXRCQm94KCkgbWlnaHQgaGF2ZSBpbnN1ZmZpY2llbnQgYnJvd3NlciBzdXBwb3J0IVxuICAgICogVGhlIGZ1bmN0aW9uIGhhcyBsaXR0bGUgZG9jdW1lbnRhdGlvbi4gSW4gY2FzZSB1c2Ugb2YgQkJveCB0dXJucyBvdXRcbiAgICAqIHByb2JsZW1hdGljLCBjb25zaWRlciB1c2luZyBgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBhbG9uZyB3aXRoXG4gICAgKiAkKCc8c3ZnPicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHRvIGNvcnJlY3QgdGhlIHggYW5kIHkgb2Zmc2V0LlxuICAgICovXG4gIGdldEJCb3ggPSAoaW5kZXgpID0+IHtcbiAgICAvLyBkZXN0cnVjdCBhbmQgY29uc3RydWN0OyAgZ2V0QkJveCByZXR1cm5zIGEgU1ZHUmVjdCB3aGljaCBkb2VzIG5vdCBzcHJlYWQuXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLm9iamVjdFJlZnNbaW5kZXhdLmdldEJCb3goKTtcbiAgICByZXR1cm4geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IHRydWUgfSksXG4gICAgbXVsdGlTZWxlY3RPZmY6ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtdWx0aVNlbGVjdDogZmFsc2UgfSlcbiAgfTtcblxuICBtYXAgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXlkb3duJyB9LFxuICAgIG11bHRpU2VsZWN0T2ZmOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleXVwJyB9XG4gIH07XG5cbiAgaXNTZWxlY3RlZFR5cGUgPSAoaW5kZXgpID0+XG4gICAgdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkVHlwZTtcblxuICBzaG91bGRSZW5kZXJIb3ZlciA9IChpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgaXNIb3ZlcmluZywgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKCFpc0hvdmVyaW5nIHx8IHNlbGVjdGVkT2JqZWN0cy5oYXMoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICByZWZDYWxsYmFjaz17cmVmID0+IHtcbiAgICAgICAgICB0aGlzLm9iamVjdFJlZnNbaW5kZXhdID0gcmVmO1xuICAgICAgICB9fSAvLyDwn5KhIFdlIHNob3VsZCB1c2UgYGNyZWF0ZVJlZmAgZnJvbSBSZWFjdCBedjE2Lnggb253YXJkcyBpbnN0ZWFkLlxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5vbk1vdXNlT3ZlcihpbmRleCl9XG4gICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm9uTW91c2VEb3duKGluZGV4LCBldmVudCl9XG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5vbk1vdXNlTGVhdmV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBtdWx0aVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXG4gICAgICBvYmplY3RzLmRlbGV0ZShpbmRleCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBhZGQgdG8gc2VsZWN0aW9uXG4gICAgICAvLyBwb3NzaWJseSwgZGlzc2Fsb3cgc2VsZWN0aW5nIGFub3RoZXIgdHlwZVxuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KTtcbiAgICAgIHJldHVybiBzYW1lVHlwZSA/IG9iamVjdHMuYWRkKGluZGV4KSA6IG9iamVjdHM7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyBkZXNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlU2VsZWN0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKG11bHRpU2VsZWN0ICYmIHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmdsZVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgY3VycmVudGx5SG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZE9iamVjdHNBcnJheSA9IFsuLi5zZWxlY3RlZE9iamVjdHNdOyAvLyBDb252ZXJ0IFNldCB0byBBcnJheVxuICAgIGNvbnN0IHJlbmRlckhvdmVyID0gdGhpcy5zaG91bGRSZW5kZXJIb3ZlcihjdXJyZW50bHlIb3ZlcmluZyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleXMga2V5TWFwPXt0aGlzLm1hcH0gaGFuZGxlcnM9e3RoaXMuaGFuZGxlcnN9IGZvY3VzZWQgYXR0YWNoPXt3aW5kb3d9PlxuICAgICAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9IHN0eWxlPXtzdHlsZXN9ID5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3JlbmRlckhvdmVyICYmIChcbiAgICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChjdXJyZW50bHlIb3ZlcmluZyl9XG4gICAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5vbk1vdXNlTGVhdmV9ICBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtzZWxlY3RlZE9iamVjdHNBcnJheS5tYXAoKG9iamVjdEluZGV4LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0QkJveChvYmplY3RJbmRleCl9XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKG9iamVjdEluZGV4LCBldmVudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvSG90S2V5cz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzdHlsZXMgPSB7XG4gIGJhY2tncm91bmRJbWFnZTogJ3VybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1J1xuICAgICsgJ3ZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwUFNJeU1DSStDanh5WldOMElIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMCdcbiAgICArICdQU0l5TUNJZ1ptbHNiRDBpSTJabVppSStQQzl5WldOMFBnbzhjbVZqZENCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJR1pwYkd3OUknXG4gICAgKyAnaU5HTjBZM1JqY2lQand2Y21WamRENEtQSEpsWTNRZ2VEMGlNVEFpSUhrOUlqRXdJaUIzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHJ1xuICAgICsgJ1pwYkd3OUlpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BDOXpkbWMrKScsXG4gIGJhY2tncm91bmRTaXplOiAnYXV0bydcbn07XG4iXX0=