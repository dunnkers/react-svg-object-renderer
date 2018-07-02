function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import SelectRect from './indicators/SelectRect';
import Surface from './Surface';
import HotKeyProvider from './HotKeyProvider';
import SVGRoot from './SVGRoot';
import { getBBox } from './Common';
export default class SVGObjectRenderer extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      hovering: -1,
      selectedObjects: new Set(),
      multiSelect: false,
      selectedType: null,
      children: null
    });

    _defineProperty(this, "startHovering", index => {
      this.setState({
        hovering: index
      });
    });

    _defineProperty(this, "stopHovering", () => this.setState({
      hovering: -1
    }));

    _defineProperty(this, "selectObjects", indices => {
      const newSelection = new Set(indices);
      this.setState({
        selectedObjects: newSelection
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(newSelection));
    });

    _defineProperty(this, "clickSelect", (index, event) => {
      event.preventDefault(); // 💡 Prevents user selecting any svg text

      const newSelection = this.computeSelection(index);
      this.setState({
        selectedObjects: newSelection
      }); // ⚡ notify outside world of selection change. convert set to array.

      this.props.onSelectionChange(Array.from(newSelection));
    });

    _defineProperty(this, "isSelectedType", index => this.props.objects[index].type === this.state.selectedType);

    _defineProperty(this, "renderObject", (object, index) => {
      const {
        x,
        y
      } = object,
            otherObjectProps = _objectWithoutProperties(object, ["x", "y"]);

      const {
        objectTypes
      } = this.props;
      const ObjectComponent = objectTypes[object.type];
      return React.createElement(ObjectComponent, _extends({
        x: x + this.props.x,
        y: y + this.props.y
      }, otherObjectProps, {
        key: index,
        nodeRef: this.objectRefs[index],
        onMouseOver: () => this.startHovering(index),
        onMouseDown: event => this.clickSelect(index, event),
        onMouseLeave: this.stopHovering
      }));
    });

    _defineProperty(this, "deselectAll", () => {
      if (this.state.selectedObjects.size > 0) {
        const selectedObjects = new Set();
        this.setState({
          selectedObjects
        }); // ⚡ notify outside world of selection change. convert set to array.

        this.props.onSelectionChange(Array.from(selectedObjects));
      }
    });

    _defineProperty(this, "computeHoverState", () => {
      const {
        selectedObjects,
        multiSelect,
        hovering
      } = this.state;
      const {
        multipleTypeSelection
      } = this.props; // don't render when object already selected

      if (hovering === -1 || selectedObjects.has(hovering)) {
        return -1;
      } // don't render when selecting objects of same type


      if (selectedObjects.size > 0 && multiSelect) {
        return this.isSelectedType(hovering) || multipleTypeSelection ? hovering : -1;
      }

      return hovering;
    });

    this.objectRefs = Object.entries(props.objects).map(() => createRef());
  }

  multiSelect(index, objects) {
    if (objects.has(index)) {
      // remove from selection
      objects.delete(index);
      return objects; // add to selection only if allowed --
    } else if (this.isSelectedType(index) || this.props.multipleTypeSelection) {
      return objects.add(index);
    } else {
      return objects;
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
    const dimensions = {
      width,
      height
    };
    const {
      selectedObjects
    } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    return React.createElement(HotKeyProvider, _extends({}, dimensions, {
      setMultiSelect: multiSelect => this.setState({
        multiSelect
      })
    }), React.createElement(SVGRoot, _extends({}, dimensions, {
      selectables: this.objectRefs,
      selectIndices: indices => this.selectObjects(indices),
      hovering: this.computeHoverState(),
      stopHover: this.stopHovering
    }), React.createElement(Surface, {
      deselectAll: this.deselectAll
    }), objects.map(this.renderObject), this.props.children, selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, getBBox(this.objectRefs[objectIndex]), {
      key: index,
      select: event => this.clickSelect(objectIndex, event)
    })))));
  }

}

_defineProperty(SVGObjectRenderer, "propTypes", {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  objects: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired
  })),
  objectTypes: PropTypes.objectOf(PropTypes.func),
  onSelectionChange: PropTypes.func,
  multipleTypeSelection: PropTypes.bool,
  children: PropTypes.node
});

_defineProperty(SVGObjectRenderer, "defaultProps", {
  x: 0,
  y: 0,
  width: 400,
  height: 400,
  objects: [],
  objectTypes: {},
  onSelectionChange: () => {},
  multipleTypeSelection: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJob3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiY2hpbGRyZW4iLCJpbmRleCIsInNldFN0YXRlIiwiaW5kaWNlcyIsIm5ld1NlbGVjdGlvbiIsIm9uU2VsZWN0aW9uQ2hhbmdlIiwiQXJyYXkiLCJmcm9tIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsInN0YXRlIiwib2JqZWN0IiwieCIsInkiLCJvdGhlck9iamVjdFByb3BzIiwib2JqZWN0VHlwZXMiLCJPYmplY3RDb21wb25lbnQiLCJvYmplY3RSZWZzIiwic3RhcnRIb3ZlcmluZyIsImNsaWNrU2VsZWN0Iiwic3RvcEhvdmVyaW5nIiwic2l6ZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsImlzU2VsZWN0ZWRUeXBlIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImRlbGV0ZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwicmVuZGVyIiwid2lkdGgiLCJoZWlnaHQiLCJkaW1lbnNpb25zIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJzZWxlY3RPYmplY3RzIiwiY29tcHV0ZUhvdmVyU3RhdGUiLCJkZXNlbGVjdEFsbCIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJu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QVVkLFVBQVVtRTtBQVhILEM7O2dCQURBN0QsaUIsa0JBZUc7QUFDcEJ1QixLQUFHLENBRGlCO0FBRXBCQyxLQUFHLENBRmlCO0FBR3BCb0IsU0FBTyxHQUhhO0FBSXBCQyxVQUFRLEdBSlk7QUFLcEIxQixXQUFTLEVBTFc7QUFNcEJPLGVBQWEsRUFOTztBQU9wQmIscUJBQW1CLE1BQU0sQ0FBRSxDQVBQO0FBUXBCb0IseUJBQXVCO0FBUkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuXHJcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9TZWxlY3RSZWN0JztcclxuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9TdXJmYWNlJztcclxuaW1wb3J0IEhvdEtleVByb3ZpZGVyIGZyb20gJy4vSG90S2V5UHJvdmlkZXInO1xyXG5pbXBvcnQgU1ZHUm9vdCBmcm9tICcuL1NWR1Jvb3QnO1xyXG5pbXBvcnQgeyBnZXRCQm94IH0gZnJvbSAnLi9Db21tb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT2JqZWN0UmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgeTogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgb2JqZWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcclxuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXHJcbiAgICB9KSksXHJcbiAgICBvYmplY3RUeXBlczogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5mdW5jKSxcclxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG11bHRpcGxlVHlwZVNlbGVjdGlvbjogUHJvcFR5cGVzLmJvb2wsXHJcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGVcclxuICB9XHJcblxyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMCxcclxuICAgIHdpZHRoOiA0MDAsXHJcbiAgICBoZWlnaHQ6IDQwMCxcclxuICAgIG9iamVjdHM6IFtdLFxyXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxyXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxyXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgc3RhdGUgPSB7XHJcbiAgICBob3ZlcmluZzogLTEsXHJcbiAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKSxcclxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcclxuICAgIHNlbGVjdGVkVHlwZTogbnVsbCxcclxuICAgIGNoaWxkcmVuOiBudWxsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0SG92ZXJpbmcgPSAoaW5kZXgpID0+IHtcclxuICAgIHRoaXMuc2V0U3RhdGUoeyBob3ZlcmluZzogaW5kZXggfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wSG92ZXJpbmcgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaG92ZXJpbmc6IC0xIH0pXHJcblxyXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRpY2VzID0+IHtcclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kaWNlcyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb24gfSk7XHJcblxyXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxyXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xyXG4gIH1cclxuXHJcbiAgY2xpY2tTZWxlY3QgPSAoaW5kZXgsIGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxyXG5cclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleCk7XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXHJcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cclxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XHJcblxyXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCB7IHgsIHksIC4uLm90aGVyT2JqZWN0UHJvcHMgfSA9IG9iamVjdDtcclxuICAgIGNvbnN0IHsgb2JqZWN0VHlwZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPE9iamVjdENvbXBvbmVudFxyXG4gICAgICAgIHg9e3ggKyB0aGlzLnByb3BzLnh9XHJcbiAgICAgICAgeT17eSArIHRoaXMucHJvcHMueX1cclxuICAgICAgICB7Li4ub3RoZXJPYmplY3RQcm9wc31cclxuICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgIG5vZGVSZWY9e3RoaXMub2JqZWN0UmVmc1tpbmRleF19XHJcbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc3RhcnRIb3ZlcmluZyhpbmRleCl9XHJcbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMuY2xpY2tTZWxlY3QoaW5kZXgsIGV2ZW50KX1cclxuICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMuc3RvcEhvdmVyaW5nfVxyXG4gICAgICAvPlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XHJcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIHJlbW92ZSBmcm9tIHNlbGVjdGlvblxyXG4gICAgICBvYmplY3RzLmRlbGV0ZShpbmRleCk7XHJcbiAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgLy8gYWRkIHRvIHNlbGVjdGlvbiBvbmx5IGlmIGFsbG93ZWQgLS1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgdGhpcy5wcm9wcy5tdWx0aXBsZVR5cGVTZWxlY3Rpb24pIHtcclxuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XHJcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XHJcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcclxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcclxuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVzZWxlY3RBbGwgPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzID0gbmV3IFNldCgpO1xyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0cyB9KTtcclxuXHJcbiAgICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cclxuICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHNlbGVjdGVkT2JqZWN0cykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcHV0ZUhvdmVyU3RhdGUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QsIGhvdmVyaW5nIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gb2JqZWN0IGFscmVhZHkgc2VsZWN0ZWRcclxuICAgIGlmIChob3ZlcmluZyA9PT0gLTEgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhob3ZlcmluZykpIHtcclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxyXG4gICAgaWYgKHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCAmJiBtdWx0aVNlbGVjdCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMuaXNTZWxlY3RlZFR5cGUoaG92ZXJpbmcpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbikgP1xyXG4gICAgICAgIGhvdmVyaW5nIDogLTE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhvdmVyaW5nO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvYmplY3RzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHsgd2lkdGgsIGhlaWdodCB9O1xyXG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICBjb25zdCBzZWxlY3RlZE9iamVjdHNBcnJheSA9IFsuLi5zZWxlY3RlZE9iamVjdHNdOyAvLyBDb252ZXJ0IFNldCB0byBBcnJheVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxIb3RLZXlQcm92aWRlciB7Li4uZGltZW5zaW9uc31cclxuICAgICAgICBzZXRNdWx0aVNlbGVjdD17bXVsdGlTZWxlY3QgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0IH0pfVxyXG4gICAgICA+XHJcbiAgICAgICAgPFNWR1Jvb3Qgey4uLmRpbWVuc2lvbnN9XHJcbiAgICAgICAgICBzZWxlY3RhYmxlcz17dGhpcy5vYmplY3RSZWZzfVxyXG4gICAgICAgICAgc2VsZWN0SW5kaWNlcz17aW5kaWNlcyA9PiB0aGlzLnNlbGVjdE9iamVjdHMoaW5kaWNlcyl9XHJcbiAgICAgICAgICBob3ZlcmluZz17dGhpcy5jb21wdXRlSG92ZXJTdGF0ZSgpfVxyXG4gICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLnN0b3BIb3ZlcmluZ31cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8U3VyZmFjZSBkZXNlbGVjdEFsbD17dGhpcy5kZXNlbGVjdEFsbH0vPlxyXG5cclxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XHJcblxyXG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcblxyXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XHJcbiAgICAgICAgICAgICAgey4uLmdldEJCb3godGhpcy5vYmplY3RSZWZzW29iamVjdEluZGV4XSl9XHJcbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cclxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5jbGlja1NlbGVjdChvYmplY3RJbmRleCwgZXZlbnQpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9TVkdSb290PlxyXG4gICAgICA8L0hvdEtleVByb3ZpZGVyPlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==