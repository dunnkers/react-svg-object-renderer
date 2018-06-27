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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJob3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGljZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0cyIsInR5cGUiLCJzdGF0ZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib2JqZWN0UmVmcyIsInN0YXJ0SG92ZXJpbmciLCJjbGlja1NlbGVjdCIsInN0b3BIb3ZlcmluZyIsInNpemUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJpc1NlbGVjdGVkVHlwZSIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJkZWxldGUiLCJhZGQiLCJzaW5nbGVTZWxlY3QiLCJjbGVhciIsInJlbmRlciIsIndpZHRoIiwiaGVpZ2h0IiwiZGltZW5zaW9ucyIsInNlbGVjdGVkT2JqZWN0c0FycmF5Iiwic2VsZWN0T2JqZWN0cyIsImNvbXB1dGVIb3ZlclN0YXRlIiwiZGVzZWxlY3RBbGwiLCJyZW5kZXJPYmplY3QiLCJvYmplY3RJbmRleCIsIm51bWJlciIsImFycmF5T2YiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3RPZiIsImZ1bmMiLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsRUFBMkJDLFNBQTNCLFFBQTRDLE9BQTVDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLE9BQU9DLFVBQVAsTUFBdUIseUJBQXZCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQjtBQUNBLE9BQU9DLGNBQVAsTUFBMkIsa0JBQTNCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsVUFBeEI7QUFFQSxlQUFlLE1BQU1DLGlCQUFOLFNBQWdDUixTQUFoQyxDQUEwQztBQTRCdkRTLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsbUNBUFg7QUFDTkMsZ0JBQVUsQ0FBQyxDQURMO0FBRU5DLHVCQUFpQixJQUFJQyxHQUFKLEVBRlg7QUFHTkMsbUJBQWEsS0FIUDtBQUlOQyxvQkFBYztBQUpSLEtBT1c7O0FBQUEsMkNBS0ZDLEtBQUQsSUFBVztBQUN6QixXQUFLQyxRQUFMLENBQWM7QUFBRU4sa0JBQVVLO0FBQVosT0FBZDtBQUNELEtBUGtCOztBQUFBLDBDQVNKLE1BQU0sS0FBS0MsUUFBTCxDQUFjO0FBQUVOLGdCQUFVLENBQUM7QUFBYixLQUFkLENBVEY7O0FBQUEsMkNBV0hPLFdBQVc7QUFDekIsWUFBTUMsZUFBZSxJQUFJTixHQUFKLENBQVFLLE9BQVIsQ0FBckI7QUFDQSxXQUFLRCxRQUFMLENBQWM7QUFBRUwseUJBQWlCTztBQUFuQixPQUFkLEVBRnlCLENBSXpCOztBQUNBLFdBQUtULEtBQUwsQ0FBV1UsaUJBQVgsQ0FBNkJDLE1BQU1DLElBQU4sQ0FBV0gsWUFBWCxDQUE3QjtBQUNELEtBakJrQjs7QUFBQSx5Q0FtQkwsQ0FBQ0gsS0FBRCxFQUFRTyxLQUFSLEtBQWtCO0FBQzlCQSxZQUFNQyxjQUFOLEdBRDhCLENBQ047O0FBRXhCLFlBQU1MLGVBQWUsS0FBS00sZ0JBQUwsQ0FBc0JULEtBQXRCLENBQXJCO0FBRUEsV0FBS0MsUUFBTCxDQUFjO0FBQ1pMLHlCQUFpQk87QUFETCxPQUFkLEVBTDhCLENBUzlCOztBQUNBLFdBQUtULEtBQUwsQ0FBV1UsaUJBQVgsQ0FBNkJDLE1BQU1DLElBQU4sQ0FBV0gsWUFBWCxDQUE3QjtBQUNELEtBOUJrQjs7QUFBQSw0Q0FnQ0RILEtBQUQsSUFDZixLQUFLTixLQUFMLENBQVdnQixPQUFYLENBQW1CVixLQUFuQixFQUEwQlcsSUFBMUIsS0FBbUMsS0FBS0MsS0FBTCxDQUFXYixZQWpDN0I7O0FBQUEsMENBbUNKLENBQUNjLE1BQUQsRUFBU2IsS0FBVCxLQUFtQjtBQUNoQyxZQUFNO0FBQUVjO0FBQUYsVUFBa0IsS0FBS3BCLEtBQTdCO0FBQ0EsWUFBTXFCLGtCQUFrQkQsWUFBWUQsT0FBT0YsSUFBbkIsQ0FBeEI7QUFFQSxhQUNFLG9CQUFDLGVBQUQsZUFDTUUsTUFETjtBQUVFLGFBQUtiLEtBRlA7QUFHRSxpQkFBUyxLQUFLZ0IsVUFBTCxDQUFnQmhCLEtBQWhCLENBSFg7QUFJRSxxQkFBYSxNQUFNLEtBQUtpQixhQUFMLENBQW1CakIsS0FBbkIsQ0FKckI7QUFLRSxxQkFBYU8sU0FBUyxLQUFLVyxXQUFMLENBQWlCbEIsS0FBakIsRUFBd0JPLEtBQXhCLENBTHhCO0FBTUUsc0JBQWMsS0FBS1k7QUFOckIsU0FERjtBQVVELEtBakRrQjs7QUFBQSx5Q0FzRkwsTUFBTTtBQUNsQixVQUFJLEtBQUtQLEtBQUwsQ0FBV2hCLGVBQVgsQ0FBMkJ3QixJQUEzQixHQUFrQyxDQUF0QyxFQUF5QztBQUN2QyxjQUFNeEIsa0JBQWtCLElBQUlDLEdBQUosRUFBeEI7QUFFQSxhQUFLSSxRQUFMLENBQWM7QUFBRUw7QUFBRixTQUFkLEVBSHVDLENBS3ZDOztBQUNBLGFBQUtGLEtBQUwsQ0FBV1UsaUJBQVgsQ0FBNkJDLE1BQU1DLElBQU4sQ0FBV1YsZUFBWCxDQUE3QjtBQUNEO0FBQ0YsS0EvRmtCOztBQUFBLCtDQWlHQyxNQUFNO0FBQ3hCLFlBQU07QUFBRUEsdUJBQUY7QUFBbUJFLG1CQUFuQjtBQUFnQ0g7QUFBaEMsVUFBNkMsS0FBS2lCLEtBQXhEO0FBQ0EsWUFBTTtBQUFFUztBQUFGLFVBQTRCLEtBQUszQixLQUF2QyxDQUZ3QixDQUl4Qjs7QUFDQSxVQUFJQyxhQUFhLENBQUMsQ0FBZCxJQUFtQkMsZ0JBQWdCMEIsR0FBaEIsQ0FBb0IzQixRQUFwQixDQUF2QixFQUFzRDtBQUNwRCxlQUFPLENBQUMsQ0FBUjtBQUNELE9BUHVCLENBU3hCOzs7QUFDQSxVQUFJQyxnQkFBZ0J3QixJQUFoQixHQUF1QixDQUF2QixJQUE0QnRCLFdBQWhDLEVBQTZDO0FBQzNDLGVBQVEsS0FBS3lCLGNBQUwsQ0FBb0I1QixRQUFwQixLQUFpQzBCLHFCQUFsQyxHQUNMMUIsUUFESyxHQUNNLENBQUMsQ0FEZDtBQUVEOztBQUVELGFBQU9BLFFBQVA7QUFDRCxLQWpIa0I7O0FBRWpCLFNBQUtxQixVQUFMLEdBQWtCUSxPQUFPQyxPQUFQLENBQWUvQixNQUFNZ0IsT0FBckIsRUFBOEJnQixHQUE5QixDQUFrQyxNQUFNekMsV0FBeEMsQ0FBbEI7QUFDRDs7QUFnRERhLGNBQVlFLEtBQVosRUFBbUJVLE9BQW5CLEVBQTRCO0FBQzFCLFFBQUlBLFFBQVFZLEdBQVIsQ0FBWXRCLEtBQVosQ0FBSixFQUF3QjtBQUFFO0FBQ3hCVSxjQUFRaUIsTUFBUixDQUFlM0IsS0FBZjtBQUNBLGFBQU9VLE9BQVAsQ0FGc0IsQ0FHeEI7QUFDQyxLQUpELE1BSU8sSUFBSSxLQUFLYSxjQUFMLENBQW9CdkIsS0FBcEIsS0FBOEIsS0FBS04sS0FBTCxDQUFXMkIscUJBQTdDLEVBQW9FO0FBQ3pFLGFBQU9YLFFBQVFrQixHQUFSLENBQVk1QixLQUFaLENBQVA7QUFDRCxLQUZNLE1BRUE7QUFDTCxhQUFPVSxPQUFQO0FBQ0Q7QUFDRjs7QUFFRG1CLGVBQWE3QixLQUFiLEVBQW9CVSxPQUFwQixFQUE2QjtBQUMzQixRQUFJQSxRQUFRWSxHQUFSLENBQVl0QixLQUFaLENBQUosRUFBd0I7QUFBRTtBQUN4QlUsY0FBUW9CLEtBQVI7QUFDQSxhQUFPcEIsT0FBUDtBQUNELEtBSEQsTUFHTztBQUFFO0FBQ1BBLGNBQVFvQixLQUFSO0FBQ0EsV0FBSzdCLFFBQUwsQ0FBYztBQUNaRixzQkFBYyxLQUFLTCxLQUFMLENBQVdnQixPQUFYLENBQW1CVixLQUFuQixFQUEwQlc7QUFENUIsT0FBZDtBQUdBLGFBQU9ELFFBQVFrQixHQUFSLENBQVk1QixLQUFaLENBQVA7QUFDRDtBQUNGOztBQUVEUyxtQkFBaUJULEtBQWpCLEVBQXdCO0FBQ3RCLFVBQU07QUFBRUoscUJBQUY7QUFBbUJFO0FBQW5CLFFBQW1DLEtBQUtjLEtBQTlDOztBQUVBLFFBQUlkLGVBQWVGLGdCQUFnQndCLElBQWhCLEdBQXVCLENBQTFDLEVBQTZDO0FBQzNDLGFBQU8sS0FBS3RCLFdBQUwsQ0FBaUJFLEtBQWpCLEVBQXdCSixlQUF4QixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFLaUMsWUFBTCxDQUFrQjdCLEtBQWxCLEVBQXlCSixlQUF6QixDQUFQO0FBQ0Q7QUFDRjs7QUErQkRtQyxXQUFTO0FBQ1AsVUFBTTtBQUFFQyxXQUFGO0FBQVNDLFlBQVQ7QUFBaUJ2QjtBQUFqQixRQUE2QixLQUFLaEIsS0FBeEM7QUFDQSxVQUFNd0MsYUFBYTtBQUFFRixXQUFGO0FBQVNDO0FBQVQsS0FBbkI7QUFDQSxVQUFNO0FBQUVyQztBQUFGLFFBQXNCLEtBQUtnQixLQUFqQztBQUNBLFVBQU11Qix1QkFBdUIsQ0FBQyxHQUFHdkMsZUFBSixDQUE3QixDQUpPLENBSTRDOztBQUVuRCxXQUNFLG9CQUFDLGNBQUQsZUFBb0JzQyxVQUFwQjtBQUNFLHNCQUFnQnBDLGVBQWUsS0FBS0csUUFBTCxDQUFjO0FBQUVIO0FBQUYsT0FBZDtBQURqQyxRQUdFLG9CQUFDLE9BQUQsZUFBYW9DLFVBQWI7QUFDRSxtQkFBYSxLQUFLbEIsVUFEcEI7QUFFRSxxQkFBZWQsV0FBVyxLQUFLa0MsYUFBTCxDQUFtQmxDLE9BQW5CLENBRjVCO0FBR0UsZ0JBQVUsS0FBS21DLGlCQUFMLEVBSFo7QUFJRSxpQkFBVyxLQUFLbEI7QUFKbEIsUUFNRSxvQkFBQyxPQUFEO0FBQVMsbUJBQWEsS0FBS21CO0FBQTNCLE1BTkYsRUFRRzVCLFFBQVFnQixHQUFSLENBQVksS0FBS2EsWUFBakIsQ0FSSCxFQVVHSixxQkFBcUJULEdBQXJCLENBQXlCLENBQUNjLFdBQUQsRUFBY3hDLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNVCxRQUFRLEtBQUt5QixVQUFMLENBQWdCd0IsV0FBaEIsQ0FBUixDQUROO0FBRUUsV0FBS3hDLEtBRlA7QUFHRSxjQUFTTyxLQUFELElBQVcsS0FBS1csV0FBTCxDQUFpQnNCLFdBQWpCLEVBQThCakMsS0FBOUI7QUFIckIsT0FERCxDQVZILENBSEYsQ0FERjtBQXdCRDs7QUE3S3NEOztnQkFBcENmLGlCLGVBQ0E7QUFDakJ3QyxTQUFPOUMsVUFBVXVELE1BREE7QUFFakJSLFVBQVEvQyxVQUFVdUQsTUFGRDtBQUdqQi9CLFdBQVN4QixVQUFVd0QsT0FBVixDQUFrQnhELFVBQVV5RCxLQUFWLENBQWdCO0FBQ3pDaEMsVUFBTXpCLFVBQVUwRCxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCL0IsZUFBYTVCLFVBQVU0RCxRQUFWLENBQW1CNUQsVUFBVTZELElBQTdCLENBTkk7QUFPakIzQyxxQkFBbUJsQixVQUFVNkQsSUFQWjtBQVFqQjFCLHlCQUF1Qm5DLFVBQVU4RDtBQVJoQixDOztnQkFEQXhELGlCLGtCQVlHO0FBQ3BCd0MsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJ2QixXQUFTLEVBSFc7QUFJcEJJLGVBQWEsRUFKTztBQUtwQlYscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCaUIseUJBQXVCO0FBTkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9TZWxlY3RSZWN0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4vU3VyZmFjZSc7XG5pbXBvcnQgSG90S2V5UHJvdmlkZXIgZnJvbSAnLi9Ib3RLZXlQcm92aWRlcic7XG5pbXBvcnQgU1ZHUm9vdCBmcm9tICcuL1NWR1Jvb3QnO1xuaW1wb3J0IHsgZ2V0QkJveCB9IGZyb20gJy4vQ29tbW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT2JqZWN0UmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvYmplY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIG9iamVjdFR5cGVzOiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmZ1bmMpLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IFByb3BUeXBlcy5ib29sXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiA0MDAsXG4gICAgb2JqZWN0czogW10sXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IGZhbHNlXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBob3ZlcmluZzogLTEsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgfVxuXG4gIHN0YXJ0SG92ZXJpbmcgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgc3RvcEhvdmVyaW5nID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGhvdmVyaW5nOiAtMSB9KVxuXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRpY2VzID0+IHtcbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBuZXcgU2V0KGluZGljZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvbiB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBjbGlja1NlbGVjdCA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5jb21wdXRlU2VsZWN0aW9uKGluZGV4KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb25cbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBub2RlUmVmPXt0aGlzLm9iamVjdFJlZnNbaW5kZXhdfVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zdGFydEhvdmVyaW5nKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMuY2xpY2tTZWxlY3QoaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLnN0b3BIb3ZlcmluZ31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIC8vIGFkZCB0byBzZWxlY3Rpb24gb25seSBpZiBhbGxvd2VkIC0tXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCB0aGlzLnByb3BzLm11bHRpcGxlVHlwZVNlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfVxuICB9XG5cbiAgc2luZ2xlU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyBkZXNlbGVjdFxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xuICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgfSBlbHNlIHsgLy8gc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdHMuYWRkKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlU2VsZWN0aW9uKGluZGV4KSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKG11bHRpU2VsZWN0ICYmIHNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmdsZVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdEFsbCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkT2JqZWN0cyB9KTtcblxuICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxuICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKHNlbGVjdGVkT2JqZWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVIb3ZlclN0YXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCwgaG92ZXJpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBtdWx0aXBsZVR5cGVTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxuICAgIGlmIChob3ZlcmluZyA9PT0gLTEgfHwgc2VsZWN0ZWRPYmplY3RzLmhhcyhob3ZlcmluZykpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBzZWxlY3Rpbmcgb2JqZWN0cyBvZiBzYW1lIHR5cGVcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XG4gICAgICByZXR1cm4gKHRoaXMuaXNTZWxlY3RlZFR5cGUoaG92ZXJpbmcpIHx8IG11bHRpcGxlVHlwZVNlbGVjdGlvbikgP1xuICAgICAgICBob3ZlcmluZyA6IC0xO1xuICAgIH1cblxuICAgIHJldHVybiBob3ZlcmluZztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHsgd2lkdGgsIGhlaWdodCB9O1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleVByb3ZpZGVyIHsuLi5kaW1lbnNpb25zfVxuICAgICAgICBzZXRNdWx0aVNlbGVjdD17bXVsdGlTZWxlY3QgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpU2VsZWN0IH0pfVxuICAgICAgPlxuICAgICAgICA8U1ZHUm9vdCB7Li4uZGltZW5zaW9uc31cbiAgICAgICAgICBzZWxlY3RhYmxlcz17dGhpcy5vYmplY3RSZWZzfVxuICAgICAgICAgIHNlbGVjdEluZGljZXM9e2luZGljZXMgPT4gdGhpcy5zZWxlY3RPYmplY3RzKGluZGljZXMpfVxuICAgICAgICAgIGhvdmVyaW5nPXt0aGlzLmNvbXB1dGVIb3ZlclN0YXRlKCl9XG4gICAgICAgICAgc3RvcEhvdmVyPXt0aGlzLnN0b3BIb3ZlcmluZ31cbiAgICAgICAgPlxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXt0aGlzLmRlc2VsZWN0QWxsfS8+XG5cbiAgICAgICAgICB7b2JqZWN0cy5tYXAodGhpcy5yZW5kZXJPYmplY3QpfVxuXG4gICAgICAgICAge3NlbGVjdGVkT2JqZWN0c0FycmF5Lm1hcCgob2JqZWN0SW5kZXgsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8U2VsZWN0UmVjdFxuICAgICAgICAgICAgICB7Li4uZ2V0QkJveCh0aGlzLm9iamVjdFJlZnNbb2JqZWN0SW5kZXhdKX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc2VsZWN0PXsoZXZlbnQpID0+IHRoaXMuY2xpY2tTZWxlY3Qob2JqZWN0SW5kZXgsIGV2ZW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU1ZHUm9vdD5cbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG4iXX0=