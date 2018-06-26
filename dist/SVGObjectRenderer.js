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
    }, this.renderSurface(), objects.map(this.renderObject), renderHover && React.createElement(HoverRect, _extends({}, this.getBBox(currentlyHovering), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TVkdPYmplY3RSZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIkhvdEtleXMiLCJIb3ZlclJlY3QiLCJTZWxlY3RSZWN0IiwiU1ZHT2JqZWN0UmVuZGVyZXIiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNIb3ZlcmluZyIsImN1cnJlbnRseUhvdmVyaW5nIiwic2VsZWN0ZWRPYmplY3RzIiwiU2V0IiwibXVsdGlTZWxlY3QiLCJzZWxlY3RlZFR5cGUiLCJpbmRleCIsInNldFN0YXRlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsInN0YXRlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIm9iamVjdFJlZnMiLCJnZXRCQm94IiwibXVsdGlTZWxlY3RPbiIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsInNpemUiLCJpc1NlbGVjdGVkVHlwZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50IiwicmVmIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlRG93biIsIm9uTW91c2VMZWF2ZSIsImRlbGV0ZSIsInNhbWVUeXBlIiwiYWRkIiwic2luZ2xlU2VsZWN0IiwiY2xlYXIiLCJyZW5kZXIiLCJzZWxlY3RlZE9iamVjdHNBcnJheSIsInJlbmRlckhvdmVyIiwic2hvdWxkUmVuZGVySG92ZXIiLCJtYXAiLCJoYW5kbGVycyIsIndpbmRvdyIsInN0eWxlcyIsInJlbmRlclN1cmZhY2UiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RPZiIsImZ1bmMiLCJib29sIiwiYmFj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QUFFcEJDLFVBQVEsR0FGWTtBQUdwQk8sV0FBUyxFQUhXO0FBSXBCTyxlQUFhLEVBSk87QUFLcEJyQixxQkFBbUIsTUFBTSxDQUFFLENBTFA7QUFNcEJnQix5QkFBdUI7QUFOSCxDOztBQTJMeEIsT0FBTyxNQUFNdUIsU0FBUztBQUNwQlksbUJBQWlCLHNFQUNiLG1GQURhLEdBRWIsbUZBRmEsR0FHYixtRkFIYSxHQUliLHlDQUxnQjtBQU1wQkMsa0JBQWdCO0FBTkksQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgSG90S2V5cyB9IGZyb20gJ3JlYWN0LWhvdGtleXMnO1xuXG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vSG92ZXJSZWN0JztcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vU2VsZWN0UmVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogNDAwLFxuICAgIGhlaWdodDogNDAwLFxuICAgIG9iamVjdHM6IFtdLFxuICAgIG9iamVjdFR5cGVzOiB7fSxcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNIb3ZlcmluZzogZmFsc2UsXG4gICAgY3VycmVudGx5SG92ZXJpbmc6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0ge307XG4gIH1cblxuICBvbk1vdXNlT3ZlciA9IChpbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0hvdmVyaW5nOiB0cnVlLCBjdXJyZW50bHlIb3ZlcmluZzogaW5kZXggfSk7XG4gIH1cblxuICBvbk1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNIb3ZlcmluZzogZmFsc2UgfSlcblxuICBvbk1vdXNlRG93biA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZE9iamVjdHM6IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleClcbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMpKTtcbiAgfVxuXG4gIC8qIOKaoFxuICAgICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcbiAgICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XG4gICAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxuICAgICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cbiAgICAqL1xuICBnZXRCQm94ID0gKGluZGV4KSA9PiB7XG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5vYmplY3RSZWZzW2luZGV4XS5nZXRCQm94KCk7XG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgaGFuZGxlcnMgPSB7XG4gICAgbXVsdGlTZWxlY3RPbjogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0OiB0cnVlIH0pLFxuICAgIG11bHRpU2VsZWN0T2ZmOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3Q6IGZhbHNlIH0pXG4gIH07XG5cbiAgbWFwID0ge1xuICAgIG11bHRpU2VsZWN0T246IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5ZG93bicgfSxcbiAgICBtdWx0aVNlbGVjdE9mZjogeyBzZXF1ZW5jZTogJ2N0cmwnLCBhY3Rpb246ICdrZXl1cCcgfVxuICB9O1xuXG4gIGlzU2VsZWN0ZWRUeXBlID0gKGluZGV4KSA9PlxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XG5cbiAgc2hvdWxkUmVuZGVySG92ZXIgPSAoaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IGlzSG92ZXJpbmcsIHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxuICAgIGlmICghaXNIb3ZlcmluZyB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGluZGV4KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBzZWxlY3Rpbmcgb2JqZWN0cyBvZiBzYW1lIHR5cGVcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVuZGVyU3VyZmFjZSA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgb3BhY2l0eT1cIjAuMFwiXG4gICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgIGhlaWdodD1cIjEwMCVcIlxuICAgICAgICBvbk1vdXNlRG93bj17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0ZWRPYmplY3RzKSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJPYmplY3QgPSAob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYmplY3RDb21wb25lbnRcbiAgICAgICAgey4uLm9iamVjdH1cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgcmVmQ2FsbGJhY2s9e3JlZiA9PiB7XG4gICAgICAgICAgdGhpcy5vYmplY3RSZWZzW2luZGV4XSA9IHJlZjtcbiAgICAgICAgfX0gLy8g8J+SoSBXZSBzaG91bGQgdXNlIGBjcmVhdGVSZWZgIGZyb20gUmVhY3QgXnYxNi54IG9ud2FyZHMgaW5zdGVhZC5cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMub25Nb3VzZU92ZXIoaW5kZXgpfVxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihpbmRleCwgZXZlbnQpfVxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMub25Nb3VzZUxlYXZlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxuICAgICAgb2JqZWN0cy5kZWxldGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gYWRkIHRvIHNlbGVjdGlvblxuICAgICAgLy8gcG9zc2libHksIGRpc3NhbG93IHNlbGVjdGluZyBhbm90aGVyIHR5cGVcbiAgICAgIGNvbnN0IHsgbXVsdGlwbGVUeXBlU2VsZWN0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2FtZVR5cGUgPSB0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCBtdWx0aXBsZVR5cGVTZWxlY3Rpb247XG4gICAgICByZXR1cm4gc2FtZVR5cGUgPyBvYmplY3RzLmFkZChpbmRleCkgOiBvYmplY3RzO1xuICAgIH1cbiAgfVxuXG4gIHNpbmdsZVNlbGVjdChpbmRleCwgb2JqZWN0cykge1xuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3RzLmFkZChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGN1cnJlbnRseUhvdmVyaW5nLCBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcbiAgICBjb25zdCByZW5kZXJIb3ZlciA9IHRoaXMuc2hvdWxkUmVuZGVySG92ZXIoY3VycmVudGx5SG92ZXJpbmcpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3RLZXlzIGtleU1hcD17dGhpcy5tYXB9IGhhbmRsZXJzPXt0aGlzLmhhbmRsZXJzfSBmb2N1c2VkIGF0dGFjaD17d2luZG93fT5cbiAgICAgICAgPHN2ZyB3aWR0aD17d2lkdGh9IGhlaWdodD17aGVpZ2h0fSBzdHlsZT17c3R5bGVzfSA+XG4gICAgICAgICAge3RoaXMucmVuZGVyU3VyZmFjZSgpfVxuXG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cblxuICAgICAgICAgIHtyZW5kZXJIb3ZlciAmJiAoXG4gICAgICAgICAgICA8SG92ZXJSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3goY3VycmVudGx5SG92ZXJpbmcpfVxuICAgICAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMub25Nb3VzZUxlYXZlfSAgXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi50aGlzLmdldEJCb3gob2JqZWN0SW5kZXgpfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L0hvdEtleXM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NSdcbiAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICsgJ2lOR04wWTNSamNpUGp3dmNtVmpkRDRLUEhKbFkzUWdlRDBpTVRBaUlIazlJakV3SWlCM2FXUjBhRDBpTVRBaUlHaGxhV2RvZEQwaU1UQWlJRydcbiAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG59O1xuIl19