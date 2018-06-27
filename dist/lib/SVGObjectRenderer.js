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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJob3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiaW5kZXgiLCJzZXRTdGF0ZSIsImluZGljZXMiLCJuZXdTZWxlY3Rpb24iLCJvblNlbGVjdGlvbkNoYW5nZSIsIkFycmF5IiwiZnJvbSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlU2VsZWN0aW9uIiwib2JqZWN0cyIsInR5cGUiLCJzdGF0ZSIsIm9iamVjdCIsIm9iamVjdFR5cGVzIiwiT2JqZWN0Q29tcG9uZW50Iiwib2JqZWN0UmVmcyIsInN0YXJ0SG92ZXJpbmciLCJjbGlja1NlbGVjdCIsInN0b3BIb3ZlcmluZyIsInNpemUiLCJtdWx0aXBsZVR5cGVTZWxlY3Rpb24iLCJoYXMiLCJpc1NlbGVjdGVkVHlwZSIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJkZWxldGUiLCJzYW1lVHlwZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwicmVuZGVyIiwid2lkdGgiLCJoZWlnaHQiLCJkaW1lbnNpb25zIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJzZWxlY3RPYmplY3RzIiwiY29tcHV0ZUhvdmVyU3RhdGUiLCJkZXNlbGVjdEFsbCIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixFQUEyQkMsU0FBM0IsUUFBNEMsT0FBNUM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsT0FBT0MsVUFBUCxNQUF1Qix5QkFBdkI7QUFDQSxPQUFPQyxPQUFQLE1BQW9CLFdBQXBCO0FBQ0EsT0FBT0MsY0FBUCxNQUEyQixrQkFBM0I7QUFDQSxPQUFPQyxPQUFQLE1BQW9CLFdBQXBCO0FBQ0EsU0FBU0MsT0FBVCxRQUF3QixVQUF4QjtBQUVBLGVBQWUsTUFBTUMsaUJBQU4sU0FBZ0NSLFNBQWhDLENBQTBDO0FBNEJ2RFMsY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOOztBQURpQixtQ0FQWDtBQUNOQyxnQkFBVSxDQUFDLENBREw7QUFFTkMsdUJBQWlCLElBQUlDLEdBQUosRUFGWDtBQUdOQyxtQkFBYSxLQUhQO0FBSU5DLG9CQUFjO0FBSlIsS0FPVzs7QUFBQSwyQ0FLRkMsS0FBRCxJQUFXO0FBQ3pCLFdBQUtDLFFBQUwsQ0FBYztBQUFFTixrQkFBVUs7QUFBWixPQUFkO0FBQ0QsS0FQa0I7O0FBQUEsMENBU0osTUFBTSxLQUFLQyxRQUFMLENBQWM7QUFBRU4sZ0JBQVUsQ0FBQztBQUFiLEtBQWQsQ0FURjs7QUFBQSwyQ0FXSE8sV0FBVztBQUN6QixZQUFNQyxlQUFlLElBQUlOLEdBQUosQ0FBUUssT0FBUixDQUFyQjtBQUNBLFdBQUtELFFBQUwsQ0FBYztBQUFFTCx5QkFBaUJPO0FBQW5CLE9BQWQsRUFGeUIsQ0FJekI7O0FBQ0EsV0FBS1QsS0FBTCxDQUFXVSxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXSCxZQUFYLENBQTdCO0FBQ0QsS0FqQmtCOztBQUFBLHlDQW1CTCxDQUFDSCxLQUFELEVBQVFPLEtBQVIsS0FBa0I7QUFDOUJBLFlBQU1DLGNBQU4sR0FEOEIsQ0FDTjs7QUFFeEIsWUFBTUwsZUFBZSxLQUFLTSxnQkFBTCxDQUFzQlQsS0FBdEIsQ0FBckI7QUFFQSxXQUFLQyxRQUFMLENBQWM7QUFDWkwseUJBQWlCTztBQURMLE9BQWQsRUFMOEIsQ0FTOUI7O0FBQ0EsV0FBS1QsS0FBTCxDQUFXVSxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXSCxZQUFYLENBQTdCO0FBQ0QsS0E5QmtCOztBQUFBLDRDQWdDREgsS0FBRCxJQUNmLEtBQUtOLEtBQUwsQ0FBV2dCLE9BQVgsQ0FBbUJWLEtBQW5CLEVBQTBCVyxJQUExQixLQUFtQyxLQUFLQyxLQUFMLENBQVdiLFlBakM3Qjs7QUFBQSwwQ0FtQ0osQ0FBQ2MsTUFBRCxFQUFTYixLQUFULEtBQW1CO0FBQ2hDLFlBQU07QUFBRWM7QUFBRixVQUFrQixLQUFLcEIsS0FBN0I7QUFDQSxZQUFNcUIsa0JBQWtCRCxZQUFZRCxPQUFPRixJQUFuQixDQUF4QjtBQUVBLGFBQ0Usb0JBQUMsZUFBRCxlQUNNRSxNQUROO0FBRUUsYUFBS2IsS0FGUDtBQUdFLGlCQUFTLEtBQUtnQixVQUFMLENBQWdCaEIsS0FBaEIsQ0FIWDtBQUlFLHFCQUFhLE1BQU0sS0FBS2lCLGFBQUwsQ0FBbUJqQixLQUFuQixDQUpyQjtBQUtFLHFCQUFhTyxTQUFTLEtBQUtXLFdBQUwsQ0FBaUJsQixLQUFqQixFQUF3Qk8sS0FBeEIsQ0FMeEI7QUFNRSxzQkFBYyxLQUFLWTtBQU5yQixTQURGO0FBVUQsS0FqRGtCOztBQUFBLHlDQXNGTCxNQUFNO0FBQ2xCLFVBQUksS0FBS1AsS0FBTCxDQUFXaEIsZUFBWCxDQUEyQndCLElBQTNCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3ZDLGNBQU14QixrQkFBa0IsSUFBSUMsR0FBSixFQUF4QjtBQUVBLGFBQUtJLFFBQUwsQ0FBYztBQUFFTDtBQUFGLFNBQWQsRUFIdUMsQ0FLdkM7O0FBQ0EsYUFBS0YsS0FBTCxDQUFXVSxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXVixlQUFYLENBQTdCO0FBQ0Q7QUFDRixLQS9Ga0I7O0FBQUEsK0NBaUdDLE1BQU07QUFDeEIsWUFBTTtBQUFFQSx1QkFBRjtBQUFtQkUsbUJBQW5CO0FBQWdDSDtBQUFoQyxVQUE2QyxLQUFLaUIsS0FBeEQ7QUFDQSxZQUFNO0FBQUVTO0FBQUYsVUFBNEIsS0FBSzNCLEtBQXZDLENBRndCLENBSXhCOztBQUNBLFVBQUlDLGFBQWEsQ0FBQyxDQUFkLElBQW1CQyxnQkFBZ0IwQixHQUFoQixDQUFvQjNCLFFBQXBCLENBQXZCLEVBQXNEO0FBQ3BELGVBQU8sQ0FBQyxDQUFSO0FBQ0QsT0FQdUIsQ0FTeEI7OztBQUNBLFVBQUlDLGdCQUFnQndCLElBQWhCLEdBQXVCLENBQXZCLElBQTRCdEIsV0FBaEMsRUFBNkM7QUFDM0MsZUFBUSxLQUFLeUIsY0FBTCxDQUFvQjVCLFFBQXBCLEtBQWlDMEIscUJBQWxDLEdBQ0wxQixRQURLLEdBQ00sQ0FBQyxDQURkO0FBRUQ7O0FBRUQsYUFBT0EsUUFBUDtBQUNELEtBakhrQjs7QUFFakIsU0FBS3FCLFVBQUwsR0FBa0JRLE9BQU9DLE9BQVAsQ0FBZS9CLE1BQU1nQixPQUFyQixFQUE4QmdCLEdBQTlCLENBQWtDLE1BQU16QyxXQUF4QyxDQUFsQjtBQUNEOztBQWdERGEsY0FBWUUsS0FBWixFQUFtQlUsT0FBbkIsRUFBNEI7QUFDMUIsUUFBSUEsUUFBUVksR0FBUixDQUFZdEIsS0FBWixDQUFKLEVBQXdCO0FBQUU7QUFDeEJVLGNBQVFpQixNQUFSLENBQWUzQixLQUFmO0FBQ0EsYUFBT1UsT0FBUDtBQUNELEtBSEQsTUFHTztBQUFFO0FBQ1A7QUFDQSxZQUFNO0FBQUVXO0FBQUYsVUFBNEIsS0FBSzNCLEtBQXZDO0FBQ0EsWUFBTWtDLFdBQVcsS0FBS0wsY0FBTCxDQUFvQnZCLEtBQXBCLEtBQThCcUIscUJBQS9DO0FBQ0EsYUFBT08sV0FBV2xCLFFBQVFtQixHQUFSLENBQVk3QixLQUFaLENBQVgsR0FBZ0NVLE9BQXZDO0FBQ0Q7QUFDRjs7QUFFRG9CLGVBQWE5QixLQUFiLEVBQW9CVSxPQUFwQixFQUE2QjtBQUMzQixRQUFJQSxRQUFRWSxHQUFSLENBQVl0QixLQUFaLENBQUosRUFBd0I7QUFBRTtBQUN4QlUsY0FBUXFCLEtBQVI7QUFDQSxhQUFPckIsT0FBUDtBQUNELEtBSEQsTUFHTztBQUFFO0FBQ1BBLGNBQVFxQixLQUFSO0FBQ0EsV0FBSzlCLFFBQUwsQ0FBYztBQUNaRixzQkFBYyxLQUFLTCxLQUFMLENBQVdnQixPQUFYLENBQW1CVixLQUFuQixFQUEwQlc7QUFENUIsT0FBZDtBQUdBLGFBQU9ELFFBQVFtQixHQUFSLENBQVk3QixLQUFaLENBQVA7QUFDRDtBQUNGOztBQUVEUyxtQkFBaUJULEtBQWpCLEVBQXdCO0FBQ3RCLFVBQU07QUFBRUoscUJBQUY7QUFBbUJFO0FBQW5CLFFBQW1DLEtBQUtjLEtBQTlDOztBQUVBLFFBQUlkLGVBQWVGLGdCQUFnQndCLElBQWhCLEdBQXVCLENBQTFDLEVBQTZDO0FBQzNDLGFBQU8sS0FBS3RCLFdBQUwsQ0FBaUJFLEtBQWpCLEVBQXdCSixlQUF4QixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFLa0MsWUFBTCxDQUFrQjlCLEtBQWxCLEVBQXlCSixlQUF6QixDQUFQO0FBQ0Q7QUFDRjs7QUErQkRvQyxXQUFTO0FBQ1AsVUFBTTtBQUFFQyxXQUFGO0FBQVNDLFlBQVQ7QUFBaUJ4QjtBQUFqQixRQUE2QixLQUFLaEIsS0FBeEM7QUFDQSxVQUFNeUMsYUFBYTtBQUFFRixXQUFGO0FBQVNDO0FBQVQsS0FBbkI7QUFDQSxVQUFNO0FBQUV0QztBQUFGLFFBQXNCLEtBQUtnQixLQUFqQztBQUNBLFVBQU13Qix1QkFBdUIsQ0FBQyxHQUFHeEMsZUFBSixDQUE3QixDQUpPLENBSTRDOztBQUVuRCxXQUNFLG9CQUFDLGNBQUQsZUFBb0J1QyxVQUFwQjtBQUNFLHNCQUFnQnJDLGVBQWUsS0FBS0csUUFBTCxDQUFjO0FBQUVIO0FBQUYsT0FBZDtBQURqQyxRQUdFLG9CQUFDLE9BQUQsZUFBYXFDLFVBQWI7QUFDRSxtQkFBYSxLQUFLbkIsVUFEcEI7QUFFRSxxQkFBZWQsV0FBVyxLQUFLbUMsYUFBTCxDQUFtQm5DLE9BQW5CLENBRjVCO0FBR0UsZ0JBQVUsS0FBS29DLGlCQUFMLEVBSFo7QUFJRSxpQkFBVyxLQUFLbkI7QUFKbEIsUUFNRSxvQkFBQyxPQUFEO0FBQVMsbUJBQWEsS0FBS29CO0FBQTNCLE1BTkYsRUFRRzdCLFFBQVFnQixHQUFSLENBQVksS0FBS2MsWUFBakIsQ0FSSCxFQVVHSixxQkFBcUJWLEdBQXJCLENBQXlCLENBQUNlLFdBQUQsRUFBY3pDLEtBQWQsS0FDeEIsb0JBQUMsVUFBRCxlQUNNVCxRQUFRLEtBQUt5QixVQUFMLENBQWdCeUIsV0FBaEIsQ0FBUixDQUROO0FBRUUsV0FBS3pDLEtBRlA7QUFHRSxjQUFTTyxLQUFELElBQVcsS0FBS1csV0FBTCxDQUFpQnVCLFdBQWpCLEVBQThCbEMsS0FBOUI7QUFIckIsT0FERCxDQVZILENBSEYsQ0FERjtBQXdCRDs7QUE3S3NEOztnQkFBcENmLGlCLGVBQ0E7QUFDakJ5QyxTQUFPL0MsVUFBVXdELE1BREE7QUFFakJSLFVBQVFoRCxVQUFVd0QsTUFGRDtBQUdqQmhDLFdBQVN4QixVQUFVeUQsT0FBVixDQUFrQnpELFVBQVUwRCxLQUFWLENBQWdCO0FBQ3pDakMsVUFBTXpCLFVBQVUyRCxNQUFWLENBQWlCQztBQURrQixHQUFoQixDQUFsQixDQUhRO0FBTWpCaEMsZUFBYTVCLFVBQVU2RCxRQUFWLENBQW1CN0QsVUFBVThELElBQTdCLENBTkk7QUFPakI1QyxxQkFBbUJsQixVQUFVOEQsSUFQWjtBQVFqQjNCLHlCQUF1Qm5DLFVBQVUrRDtBQVJoQixDOztnQkFEQXpELGlCLGtCQVlHO0FBQ3BCeUMsU0FBTyxHQURhO0FBRXBCQyxVQUFRLEdBRlk7QUFHcEJ4QixXQUFTLEVBSFc7QUFJcEJJLGVBQWEsRUFKTztBQUtwQlYscUJBQW1CLE1BQU0sQ0FBRSxDQUxQO0FBTXBCaUIseUJBQXVCO0FBTkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBTZWxlY3RSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9TZWxlY3RSZWN0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4vU3VyZmFjZSc7XG5pbXBvcnQgSG90S2V5UHJvdmlkZXIgZnJvbSAnLi9Ib3RLZXlQcm92aWRlcic7XG5pbXBvcnQgU1ZHUm9vdCBmcm9tICcuL1NWR1Jvb3QnO1xuaW1wb3J0IHsgZ2V0QkJveCB9IGZyb20gJy4vQ29tbW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT2JqZWN0UmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvYmplY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIG9iamVjdFR5cGVzOiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmZ1bmMpLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IFByb3BUeXBlcy5ib29sXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiA0MDAsXG4gICAgb2JqZWN0czogW10sXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgICBtdWx0aXBsZVR5cGVTZWxlY3Rpb246IGZhbHNlXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBob3ZlcmluZzogLTEsXG4gICAgc2VsZWN0ZWRPYmplY3RzOiBuZXcgU2V0KCksXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHNlbGVjdGVkVHlwZTogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcbiAgfVxuXG4gIHN0YXJ0SG92ZXJpbmcgPSAoaW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaG92ZXJpbmc6IGluZGV4IH0pO1xuICB9XG5cbiAgc3RvcEhvdmVyaW5nID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGhvdmVyaW5nOiAtMSB9KVxuXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRpY2VzID0+IHtcbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBuZXcgU2V0KGluZGljZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZE9iamVjdHM6IG5ld1NlbGVjdGlvbiB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBjbGlja1NlbGVjdCA9IChpbmRleCwgZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxuXG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5jb21wdXRlU2VsZWN0aW9uKGluZGV4KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb25cbiAgICB9KTtcblxuICAgIC8vIOKaoSBub3RpZnkgb3V0c2lkZSB3b3JsZCBvZiBzZWxlY3Rpb24gY2hhbmdlLiBjb252ZXJ0IHNldCB0byBhcnJheS5cbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XG4gIH1cblxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cbiAgICB0aGlzLnByb3BzLm9iamVjdHNbaW5kZXhdLnR5cGUgPT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUeXBlO1xuXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBvYmplY3RUeXBlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBPYmplY3RDb21wb25lbnQgPSBvYmplY3RUeXBlc1tvYmplY3QudHlwZV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9iamVjdENvbXBvbmVudFxuICAgICAgICB7Li4ub2JqZWN0fVxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBub2RlUmVmPXt0aGlzLm9iamVjdFJlZnNbaW5kZXhdfVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zdGFydEhvdmVyaW5nKGluZGV4KX1cbiAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMuY2xpY2tTZWxlY3QoaW5kZXgsIGV2ZW50KX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLnN0b3BIb3ZlcmluZ31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG11bHRpU2VsZWN0KGluZGV4LCBvYmplY3RzKSB7XG4gICAgaWYgKG9iamVjdHMuaGFzKGluZGV4KSkgeyAvLyByZW1vdmUgZnJvbSBzZWxlY3Rpb25cbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcbiAgICAgIHJldHVybiBvYmplY3RzO1xuICAgIH0gZWxzZSB7IC8vIGFkZCB0byBzZWxlY3Rpb25cbiAgICAgIC8vIHBvc3NpYmx5LCBkaXNzYWxvdyBzZWxlY3RpbmcgYW5vdGhlciB0eXBlXG4gICAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNhbWVUeXBlID0gdGhpcy5pc1NlbGVjdGVkVHlwZShpbmRleCkgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uO1xuICAgICAgcmV0dXJuIHNhbWVUeXBlID8gb2JqZWN0cy5hZGQoaW5kZXgpIDogb2JqZWN0cztcbiAgICB9XG4gIH1cblxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcbiAgICBpZiAob2JqZWN0cy5oYXMoaW5kZXgpKSB7IC8vIGRlc2VsZWN0XG4gICAgICBvYmplY3RzLmNsZWFyKCk7XG4gICAgICByZXR1cm4gb2JqZWN0cztcbiAgICB9IGVsc2UgeyAvLyBzZWxlY3RcbiAgICAgIG9iamVjdHMuY2xlYXIoKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZFR5cGU6IHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVTZWxlY3Rpb24oaW5kZXgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cywgbXVsdGlTZWxlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAobXVsdGlTZWxlY3QgJiYgc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aVNlbGVjdChpbmRleCwgc2VsZWN0ZWRPYmplY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlU2VsZWN0KGluZGV4LCBzZWxlY3RlZE9iamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIGRlc2VsZWN0QWxsID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzIH0pO1xuXG4gICAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20oc2VsZWN0ZWRPYmplY3RzKSk7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZUhvdmVyU3RhdGUgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0LCBob3ZlcmluZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIG9iamVjdCBhbHJlYWR5IHNlbGVjdGVkXG4gICAgaWYgKGhvdmVyaW5nID09PSAtMSB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGhvdmVyaW5nKSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8vIGRvbid0IHJlbmRlciB3aGVuIHNlbGVjdGluZyBvYmplY3RzIG9mIHNhbWUgdHlwZVxuICAgIGlmIChzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDAgJiYgbXVsdGlTZWxlY3QpIHtcbiAgICAgIHJldHVybiAodGhpcy5pc1NlbGVjdGVkVHlwZShob3ZlcmluZykgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uKSA/XG4gICAgICAgIGhvdmVyaW5nIDogLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvdmVyaW5nO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgb2JqZWN0cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkaW1lbnNpb25zID0geyB3aWR0aCwgaGVpZ2h0IH07XG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRPYmplY3RzQXJyYXkgPSBbLi4uc2VsZWN0ZWRPYmplY3RzXTsgLy8gQ29udmVydCBTZXQgdG8gQXJyYXlcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5UHJvdmlkZXIgey4uLmRpbWVuc2lvbnN9XG4gICAgICAgIHNldE11bHRpU2VsZWN0PXttdWx0aVNlbGVjdCA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3QgfSl9XG4gICAgICA+XG4gICAgICAgIDxTVkdSb290IHsuLi5kaW1lbnNpb25zfVxuICAgICAgICAgIHNlbGVjdGFibGVzPXt0aGlzLm9iamVjdFJlZnN9XG4gICAgICAgICAgc2VsZWN0SW5kaWNlcz17aW5kaWNlcyA9PiB0aGlzLnNlbGVjdE9iamVjdHMoaW5kaWNlcyl9XG4gICAgICAgICAgaG92ZXJpbmc9e3RoaXMuY29tcHV0ZUhvdmVyU3RhdGUoKX1cbiAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMuc3RvcEhvdmVyaW5nfVxuICAgICAgICA+XG4gICAgICAgICAgPFN1cmZhY2UgZGVzZWxlY3RBbGw9e3RoaXMuZGVzZWxlY3RBbGx9Lz5cblxuICAgICAgICAgIHtvYmplY3RzLm1hcCh0aGlzLnJlbmRlck9iamVjdCl9XG5cbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxTZWxlY3RSZWN0XG4gICAgICAgICAgICAgIHsuLi5nZXRCQm94KHRoaXMub2JqZWN0UmVmc1tvYmplY3RJbmRleF0pfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzZWxlY3Q9eyhldmVudCkgPT4gdGhpcy5jbGlja1NlbGVjdChvYmplY3RJbmRleCwgZXZlbnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9TVkdSb290PlxuICAgICAgPC9Ib3RLZXlQcm92aWRlcj5cbiAgICApO1xuICB9XG59XG5cbiJdfQ==