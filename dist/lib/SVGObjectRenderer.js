function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
      selectedType: null
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
        objectTypes
      } = this.props;
      const ObjectComponent = objectTypes[object.type];
      return React.createElement(ObjectComponent, _extends({}, object, {
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
    }), objects.map(this.renderObject), selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, getBBox(this.objectRefs[objectIndex]), {
      key: index,
      select: event => this.clickSelect(objectIndex, event)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJob3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGljZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0cyIsInR5cGUiLCJzdGF0ZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib2JqZWN0UmVmcyIsInN0YXJ0SG92ZXJpbmciLCJjbGlja1NlbGVjdCIsInN0b3BIb3ZlcmluZyIsInNpemUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJpc1NlbGVjdGVkVHlwZSIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJkZWxldGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJjbGVhciIsInJlbmRlciIsIndpZHRoIiwiaGVpZ2h0IiwiZGltZW5zaW9ucyIsInNlbGVjdGVkT2JqZWN0c0FycmF5Iiwic2VsZWN0T2JqZWN0cyIsImNvbXB1dGVIb3ZlclN0YXRlIiwiZGVzZWxlY3RBbGwiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RPZiIsImZ1bmMiLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMs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S21CO0FBQTNCLE1BTkYsRUFRRzVCLFFBQVFnQixHQUFSLENBQVksS0FBS2EsWUFBakIsQ0FSSCxFQVVHSixxQkFBcUJULEdBQXJCLENBQXlCLENBQUNjLFdBQUQsRUFBY3hDLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNVCxRQUFRLEtBQUt5QixVQUFMLENBQWdCd0IsV0FBaEIsQ0FBUixDQUROO0FBRUUsV0FBS3hDLEtBRlA7QUFHRSxjQUFTTyxLQUFELElBQVcsS0FBS1csV0FBTCxDQUFpQnNCLFdBQWpCLEVBQThCakMsS0FBOUI7QUFIckIsT0FERCxDQVZILENBSEYsQ0FERjtBQXdCRDs7QUE3S3NEOztnQkFBcENmLGlCLGVBQ0E7QUFDakJ3QyxTQUFPOUMsVUFBVXVELE1BREE7QUFFakJSLFVBQVEvQyxVQUFVdUQsTUFGRDtBQUdqQi9CLFdBQVN4QixVQUFVd0QsT0FBVixDQUFrQnhELFVBQVV5RCxLQUFWLENBQWdCO0FBQ3pDaEMsVUFBTXpCLFVBQVUwRCxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCL0IsZUFBYTVCLFVBQVU0RCxRQUFWLENBQW1CNUQsVUFBVTZELElBQTdCLENBTkk7QUFPakIzQyxxQkFBbUJsQixVQUFVNkQsSUFQWjtBQVFqQjFCLHlCQUF1Qm5DLFVBQVU4RDtBQVJoQixDOztnQkFEQXhELGlCLGtCQVlHO0FBQ3BCd0MsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJ2QixXQUFTLEVBSFc7QUFJcEJJLGVBQWEsRUFKTztBQUtwQlYscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCaUIseUJBQXVCO0FBTkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuXHJcbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9TZWxlY3RSZWN0JztcclxuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9TdXJmYWNlJztcclxuaW1wb3J0IEhvdEtleVByb3ZpZGVyIGZyb20gJy4vSG90S2V5UHJvdmlkZXInO1xyXG5pbXBvcnQgU1ZHUm9vdCBmcm9tICcuL1NWR1Jvb3QnO1xyXG5pbXBvcnQgeyBnZXRCQm94IH0gZnJvbSAnLi9Db21tb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT2JqZWN0UmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIG9iamVjdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XHJcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxyXG4gICAgfSkpLFxyXG4gICAgb2JqZWN0VHlwZXM6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuZnVuYyksXHJcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IFByb3BUeXBlcy5ib29sXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgd2lkdGg6IDQwMCxcclxuICAgIGhlaWdodDogNDAwLFxyXG4gICAgb2JqZWN0czogW10sXHJcbiAgICBvYmplY3RUeXBlczoge30sXHJcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogKCkgPT4ge30sXHJcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IGZhbHNlXHJcbiAgfVxyXG5cclxuICBzdGF0ZSA9IHtcclxuICAgIGhvdmVyaW5nOiAtMSxcclxuICAgIHNlbGVjdGVkT2JqZWN0czogbmV3IFNldCgpLFxyXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxyXG4gICAgc2VsZWN0ZWRUeXBlOiBudWxsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0SG92ZXJpbmcgPSAoaW5kZXgpID0+IHtcclxuICAgIHRoaXMuc2V0U3RhdGUoeyBob3ZlcmluZzogaW5kZXggfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wSG92ZXJpbmcgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaG92ZXJpbmc6IC0xIH0pXHJcblxyXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRpY2VzID0+IHtcclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kaWNlcyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb24gfSk7XHJcblxyXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxyXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xyXG4gIH1cclxuXHJcbiAgY2xpY2tTZWxlY3QgPSAoaW5kZXgsIGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxyXG5cclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleCk7XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXHJcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cclxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XHJcblxyXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxPYmplY3RDb21wb25lbnRcclxuICAgICAgICB7Li4ub2JqZWN0fVxyXG4gICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cclxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zdGFydEhvdmVyaW5nKGluZGV4KX1cclxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5jbGlja1NlbGVjdChpbmRleCwgZXZlbnQpfVxyXG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5zdG9wSG92ZXJpbmd9XHJcbiAgICAgIC8+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcclxuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXHJcbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICAvLyBhZGQgdG8gc2VsZWN0aW9uIG9ubHkgaWYgYWxsb3dlZCAtLVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCB0aGlzLnByb3BzLm11bHRpcGxlVHlwZVNlbGVjdGlvbikge1xyXG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcclxuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcclxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xyXG4gICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxyXG4gICAgICBvYmplY3RzLmNsZWFyKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xyXG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZXNlbGVjdEFsbCA9ICgpID0+IHtcclxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZE9iamVjdHMgPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzIH0pO1xyXG5cclxuICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxyXG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20oc2VsZWN0ZWRPYmplY3RzKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wdXRlSG92ZXJTdGF0ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCwgaG92ZXJpbmcgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxyXG4gICAgaWYgKGhvdmVyaW5nID09PSAtMSB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGhvdmVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXHJcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XHJcbiAgICAgIHJldHVybiAodGhpcy5pc1NlbGVjdGVkVHlwZShob3ZlcmluZykgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uKSA/XHJcbiAgICAgICAgaG92ZXJpbmcgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaG92ZXJpbmc7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0geyB3aWR0aCwgaGVpZ2h0IH07XHJcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cyB9ID0gdGhpcy5zdGF0ZTtcclxuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEhvdEtleVByb3ZpZGVyIHsuLi5kaW1lbnNpb25zfVxyXG4gICAgICAgIHNldE11bHRpU2VsZWN0PXttdWx0aVNlbGVjdCA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3QgfSl9XHJcbiAgICAgID5cclxuICAgICAgICA8U1ZHUm9vdCB7Li4uZGltZW5zaW9uc31cclxuICAgICAgICAgIHNlbGVjdGFibGVzPXt0aGlzLm9iamVjdFJlZnN9XHJcbiAgICAgICAgICBzZWxlY3RJbmRpY2VzPXtpbmRpY2VzID0+IHRoaXMuc2VsZWN0T2JqZWN0cyhpbmRpY2VzKX1cclxuICAgICAgICAgIGhvdmVyaW5nPXt0aGlzLmNvbXB1dGVIb3ZlclN0YXRlKCl9XHJcbiAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMuc3RvcEhvdmVyaW5nfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXt0aGlzLmRlc2VsZWN0QWxsfS8+XHJcblxyXG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cclxuXHJcbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcclxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcclxuICAgICAgICAgICAgICB7Li4uZ2V0QkJveCh0aGlzLm9iamVjdFJlZnNbb2JqZWN0SW5kZXhdKX1cclxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLmNsaWNrU2VsZWN0KG9iamVjdEluZGV4LCBldmVudCl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L1NWR1Jvb3Q+XHJcbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuIl19