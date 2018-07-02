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
    }), objects.map(this.renderObject), this.props.children, selectedObjectsArray.map((objectIndex, index) => React.createElement(SelectRect, _extends({}, getBBox(this.objectRefs[objectIndex]), {
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
  multipleTypeSelection: PropTypes.bool,
  children: PropTypes.node
});

_defineProperty(SVGObjectRenderer, "defaultProps", {
  width: 400,
  height: 400,
  objects: [],
  objectTypes: {},
  onSelectionChange: () => {},
  multipleTypeSelection: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHT2JqZWN0UmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVSZWYiLCJQcm9wVHlwZXMiLCJTZWxlY3RSZWN0IiwiU3VyZmFjZSIsIkhvdEtleVByb3ZpZGVyIiwiU1ZHUm9vdCIsImdldEJCb3giLCJTVkdPYmplY3RSZW5kZXJlciIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJob3ZlcmluZyIsInNlbGVjdGVkT2JqZWN0cyIsIlNldCIsIm11bHRpU2VsZWN0Iiwic2VsZWN0ZWRUeXBlIiwiY2hpbGRyZW4iLCJpbmRleCIsInNldFN0YXRlIiwiaW5kaWNlcyIsIm5ld1NlbGVjdGlvbiIsIm9uU2VsZWN0aW9uQ2hhbmdlIiwiQXJyYXkiLCJmcm9tIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNvbXB1dGVTZWxlY3Rpb24iLCJvYmplY3RzIiwidHlwZSIsInN0YXRlIiwib2JqZWN0Iiwib2JqZWN0VHlwZXMiLCJPYmplY3RDb21wb25lbnQiLCJvYmplY3RSZWZzIiwic3RhcnRIb3ZlcmluZyIsImNsaWNrU2VsZWN0Iiwic3RvcEhvdmVyaW5nIiwic2l6ZSIsIm11bHRpcGxlVHlwZVNlbGVjdGlvbiIsImhhcyIsImlzU2VsZWN0ZWRUeXBlIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImRlbGV0ZSIsImFkZCIsInNpbmdsZVNlbGVjdCIsImNsZWFyIiwicmVuZGVyIiwid2lkdGgiLCJoZWlnaHQiLCJkaW1lbnNpb25zIiwic2VsZWN0ZWRPYmplY3RzQXJyYXkiLCJzZWxlY3RPYmplY3RzIiwiY29tcHV0ZUhvdmVyU3RhdGUiLCJkZXNlbGVjdEFsbCIsInJlbmRlck9iamVjdCIsIm9iamVjdEluZGV4IiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdE9mIiwiZnVuYyIsImJvb2wiLCJub2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsRUFBMkJDLFNBQTNCLFFBQTRDLE9BQTVDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLE9BQU9DLFVBQVAsTUFBdUIseUJBQXZCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQjtBQUNBLE9BQU9DLGNBQVAsTUFBMkIsa0JBQTNCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsVUFBeEI7QUFFQSxlQUFlLE1BQU1DLGlCQUFOLFNBQWdDUixTQUFoQyxDQUEwQztBQThCdkRTLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsbUNBUlg7QUFDTkMsZ0JBQVUsQ0FBQyxDQURMO0FBRU5DLHVCQUFpQixJQUFJQyxHQUFKLEVBRlg7QUFHTkMsbUJBQWEsS0FIUDtBQUlOQyxvQkFBYyxJQUpSO0FBS05DLGdCQUFVO0FBTEosS0FRVzs7QUFBQSwyQ0FLRkMsS0FBRCxJQUFXO0FBQ3pCLFdBQUtDLFFBQUwsQ0FBYztBQUFFUCxrQkFBVU07QUFBWixPQUFkO0FBQ0QsS0FQa0I7O0FBQUEsMENBU0osTUFBTSxLQUFLQyxRQUFMLENBQWM7QUFBRVAsZ0JBQVUsQ0FBQztBQUFiLEtBQWQsQ0FURjs7QUFBQSwyQ0FXSFEsV0FBVztBQUN6QixZQUFNQyxlQUFlLElBQUlQLEdBQUosQ0FBUU0sT0FBUixDQUFyQjtBQUNBLFdBQUtELFFBQUwsQ0FBYztBQUFFTix5QkFBaUJRO0FBQW5CLE9BQWQsRUFGeUIsQ0FJekI7O0FBQ0EsV0FBS1YsS0FBTCxDQUFXVyxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXSCxZQUFYLENBQTdCO0FBQ0QsS0FqQmtCOztBQUFBLHlDQW1CTCxDQUFDSCxLQUFELEVBQVFPLEtBQVIsS0FBa0I7QUFDOUJBLFlBQU1DLGNBQU4sR0FEOEIsQ0FDTjs7QUFFeEIsWUFBTUwsZUFBZSxLQUFLTSxnQkFBTCxDQUFzQlQsS0FBdEIsQ0FBckI7QUFFQSxXQUFLQyxRQUFMLENBQWM7QUFDWk4seUJBQWlCUTtBQURMLE9BQWQsRUFMOEIsQ0FTOUI7O0FBQ0EsV0FBS1YsS0FBTCxDQUFXVyxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXSCxZQUFYLENBQTdCO0FBQ0QsS0E5QmtCOztBQUFBLDRDQWdDREgsS0FBRCxJQUNmLEtBQUtQLEtBQUwsQ0FBV2lCLE9BQVgsQ0FBbUJWLEtBQW5CLEVBQTBCVyxJQUExQixLQUFtQyxLQUFLQyxLQUFMLENBQVdkLFlBakM3Qjs7QUFBQSwwQ0FtQ0osQ0FBQ2UsTUFBRCxFQUFTYixLQUFULEtBQW1CO0FBQ2hDLFlBQU07QUFBRWM7QUFBRixVQUFrQixLQUFLckIsS0FBN0I7QUFDQSxZQUFNc0Isa0JBQWtCRCxZQUFZRCxPQUFPRixJQUFuQixDQUF4QjtBQUVBLGFBQ0Usb0JBQUMsZUFBRCxlQUNNRSxNQUROO0FBRUUsYUFBS2IsS0FGUDtBQUdFLGlCQUFTLEtBQUtnQixVQUFMLENBQWdCaEIsS0FBaEIsQ0FIWDtBQUlFLHFCQUFhLE1BQU0sS0FBS2lCLGFBQUwsQ0FBbUJqQixLQUFuQixDQUpyQjtBQUtFLHFCQUFhTyxTQUFTLEtBQUtXLFdBQUwsQ0FBaUJsQixLQUFqQixFQUF3Qk8sS0FBeEIsQ0FMeEI7QUFNRSxzQkFBYyxLQUFLWTtBQU5yQixTQURGO0FBVUQsS0FqRGtCOztBQUFBLHlDQXNGTCxNQUFNO0FBQ2xCLFVBQUksS0FBS1AsS0FBTCxDQUFXakIsZUFBWCxDQUEyQnlCLElBQTNCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3ZDLGNBQU16QixrQkFBa0IsSUFBSUMsR0FBSixFQUF4QjtBQUVBLGFBQUtLLFFBQUwsQ0FBYztBQUFFTjtBQUFGLFNBQWQsRUFIdUMsQ0FLdkM7O0FBQ0EsYUFBS0YsS0FBTCxDQUFXVyxpQkFBWCxDQUE2QkMsTUFBTUMsSUFBTixDQUFXWCxlQUFYLENBQTdCO0FBQ0Q7QUFDRixLQS9Ga0I7O0FBQUEsK0NBaUdDLE1BQU07QUFDeEIsWUFBTTtBQUFFQSx1QkFBRjtBQUFtQkUsbUJBQW5CO0FBQWdDSDtBQUFoQyxVQUE2QyxLQUFLa0IsS0FBeEQ7QUFDQSxZQUFNO0FBQUVTO0FBQUYsVUFBNEIsS0FBSzVCLEtBQXZDLENBRndCLENBSXhCOztBQUNBLFVBQUlDLGFBQWEsQ0FBQyxDQUFkLElBQW1CQyxnQkFBZ0IyQixHQUFoQixDQUFvQjVCLFFBQXBCLENBQXZCLEVBQXNEO0FBQ3BELGVBQU8sQ0FBQyxDQUFSO0FBQ0QsT0FQdUIsQ0FTeEI7OztBQUNBLFVBQUlDLGdCQUFnQnlCLElBQWhCLEdBQXVCLENBQXZCLElBQTRCdkIsV0FBaEMsRUFBNkM7QUFDM0MsZUFBUSxLQUFLMEIsY0FBTCxDQUFvQjdCLFFBQXBCLEtBQWlDMkIscUJBQWxDLEdBQ0wzQixRQURLLEdBQ00sQ0FBQyxDQURkO0FBRUQ7O0FBRUQsYUFBT0EsUUFBUDtBQUNELEtBakhrQjs7QUFFakIsU0FBS3NCLFVBQUwsR0FBa0JRLE9BQU9DLE9BQVAsQ0FBZWhDLE1BQU1pQixPQUFyQixFQUE4QmdCLEdBQTlCLENBQWtDLE1BQU0xQyxXQUF4QyxDQUFsQjtBQUNEOztBQWdERGEsY0FBWUcsS0FBWixFQUFtQlUsT0FBbkIsRUFBNEI7QUFDMUIsUUFBSUEsUUFBUVksR0FBUixDQUFZdEIsS0FBWixDQUFKLEVBQXdCO0FBQUU7QUFDeEJVLGNBQVFpQixNQUFSLENBQWUzQixLQUFmO0FBQ0EsYUFBT1UsT0FBUCxDQUZzQixDQUd4QjtBQUNDLEtBSkQsTUFJTyxJQUFJLEtBQUthLGNBQUwsQ0FBb0J2QixLQUFwQixLQUE4QixLQUFLUCxLQUFMLENBQVc0QixxQkFBN0MsRUFBb0U7QUFDekUsYUFBT1gsUUFBUWtCLEdBQVIsQ0FBWTVCLEtBQVosQ0FBUDtBQUNELEtBRk0sTUFFQTtBQUNMLGFBQU9VLE9BQVA7QUFDRDtBQUNGOztBQUVEbUIsZUFBYTdCLEtBQWIsRUFBb0JVLE9BQXBCLEVBQTZCO0FBQzNCLFFBQUlBLFFBQVFZLEdBQVIsQ0FBWXRCLEtBQVosQ0FBSixFQUF3QjtBQUFFO0FBQ3hCVSxjQUFRb0IsS0FBUjtBQUNBLGFBQU9wQixPQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQUU7QUFDUEEsY0FBUW9CLEtBQVI7QUFDQSxXQUFLN0IsUUFBTCxDQUFjO0FBQ1pILHNCQUFjLEtBQUtMLEtBQUwsQ0FBV2lCLE9BQVgsQ0FBbUJWLEtBQW5CLEVBQTBCVztBQUQ1QixPQUFkO0FBR0EsYUFBT0QsUUFBUWtCLEdBQVIsQ0FBWTVCLEtBQVosQ0FBUDtBQUNEO0FBQ0Y7O0FBRURTLG1CQUFpQlQsS0FBakIsRUFBd0I7QUFDdEIsVUFBTTtBQUFFTCxxQkFBRjtBQUFtQkU7QUFBbkIsUUFBbUMsS0FBS2UsS0FBOUM7O0FBRUEsUUFBSWYsZUFBZUYsZ0JBQWdCeUIsSUFBaEIsR0FBdUIsQ0FBMUMsRUFBNkM7QUFDM0MsYUFBTyxLQUFLdkIsV0FBTCxDQUFpQkcsS0FBakIsRUFBd0JMLGVBQXhCLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLEtBQUtrQyxZQUFMLENBQWtCN0IsS0FBbEIsRUFBeUJMLGVBQXpCLENBQVA7QUFDRDtBQUNGOztBQStCRG9DLFdBQVM7QUFDUCxVQUFNO0FBQUVDLFdBQUY7QUFBU0MsWUFBVDtBQUFpQnZCO0FBQWpCLFFBQTZCLEtBQUtqQixLQUF4QztBQUNBLFVBQU15QyxhQUFhO0FBQUVGLFdBQUY7QUFBU0M7QUFBVCxLQUFuQjtBQUNBLFVBQU07QUFBRXRDO0FBQUYsUUFBc0IsS0FBS2lCLEtBQWpDO0FBQ0EsVUFBTXVCLHVCQUF1QixDQUFDLEdBQUd4QyxlQUFKLENBQTdCLENBSk8sQ0FJNEM7O0FBRW5ELFdBQ0Usb0JBQUMsY0FBRCxlQUFvQnVDLFVBQXBCO0FBQ0Usc0JBQWdCckMsZUFBZSxLQUFLSSxRQUFMLENBQWM7QUFBRUo7QUFBRixPQUFkO0FBRGpDLFFBR0Usb0JBQUMsT0FBRCxlQUFhcUMsVUFBYjtBQUNFLG1CQUFhLEtBQUtsQixVQURwQjtBQUVFLHFCQUFlZCxXQUFXLEtBQUtrQyxhQUFMLENBQW1CbEMsT0FBbkIsQ0FGNUI7QUFHRSxnQkFBVSxLQUFLbUMsaUJBQUwsRUFIWjtBQUlFLGlCQUFXLEtBQUtsQjtBQUpsQixRQU1FLG9CQUFDLE9BQUQ7QUFBUyxtQkFBYSxLQUFLbUI7QUFBM0IsTUFORixFQVFHNUIsUUFBUWdCLEdBQVIsQ0FBWSxLQUFLYSxZQUFqQixDQVJILEVBVUcsS0FBSzlDLEtBQUwsQ0FBV00sUUFWZCxFQVlHb0MscUJBQXFCVCxHQUFyQixDQUF5QixDQUFDYyxXQUFELEVBQWN4QyxLQUFkLEtBQ3hCLG9CQUFDLFVBQUQsZUFDTVYsUUFBUSxLQUFLMEIsVUFBTCxDQUFnQndCLFdBQWhCLENBQVIsQ0FETjtBQUVFLFdBQUt4QyxLQUZQO0FBR0UsY0FBU08sS0FBRCxJQUFXLEtBQUtXLFdBQUwsQ0FBaUJzQixXQUFqQixFQUE4QmpDLEtBQTlCO0FBSHJCLE9BREQsQ0FaSCxDQUhGLENBREY7QUEwQkQ7O0FBakxzRDs7Z0JBQXBDaEIsaUIsZUFDQTtBQUNqQnlDLFNBQU8vQyxVQUFVd0QsTUFEQTtBQUVqQlIsVUFBUWhELFVBQVV3RCxNQUZEO0FBR2pCL0IsV0FBU3pCLFVBQVV5RCxPQUFWLENBQWtCekQsVUFBVTBELEtBQVYsQ0FBZ0I7QUFDekNoQyxVQUFNMUIsVUFBVTJELE1BQVYsQ0FBaUJDO0FBRGtCLEdBQWhCLENBQWxCLENBSFE7QUFNakIvQixlQUFhN0IsVUFBVTZELFFBQVYsQ0FBbUI3RCxVQUFVOEQsSUFBN0IsQ0FOSTtBQU9qQjNDLHFCQUFtQm5CLFVBQVU4RCxJQVBaO0FBUWpCMUIseUJBQXVCcEMsVUFBVStELElBUmhCO0FBU2pCakQsWUFBVWQsVUFBVWdFO0FBVEgsQzs7Z0JBREExRCxpQixrQkFhRztBQUNwQnlDLFNBQU8sR0FEYTtBQUVwQkMsVUFBUSxHQUZZO0FBR3BCdkIsV0FBUyxFQUhXO0FBSXBCSSxlQUFhLEVBSk87QUFLcEJWLHFCQUFtQixNQUFNLENBQUUsQ0FMUDtBQU1wQmlCLHlCQUF1QjtBQU5ILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcblxyXG5pbXBvcnQgU2VsZWN0UmVjdCBmcm9tICcuL2luZGljYXRvcnMvU2VsZWN0UmVjdCc7XHJcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4vU3VyZmFjZSc7XHJcbmltcG9ydCBIb3RLZXlQcm92aWRlciBmcm9tICcuL0hvdEtleVByb3ZpZGVyJztcclxuaW1wb3J0IFNWR1Jvb3QgZnJvbSAnLi9TVkdSb290JztcclxuaW1wb3J0IHsgZ2V0QkJveCB9IGZyb20gJy4vQ29tbW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR09iamVjdFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBvYmplY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xyXG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcclxuICAgIH0pKSxcclxuICAgIG9iamVjdFR5cGVzOiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmZ1bmMpLFxyXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxyXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBQcm9wVHlwZXMuYm9vbCxcclxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHdpZHRoOiA0MDAsXHJcbiAgICBoZWlnaHQ6IDQwMCxcclxuICAgIG9iamVjdHM6IFtdLFxyXG4gICAgb2JqZWN0VHlwZXM6IHt9LFxyXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHt9LFxyXG4gICAgbXVsdGlwbGVUeXBlU2VsZWN0aW9uOiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgc3RhdGUgPSB7XHJcbiAgICBob3ZlcmluZzogLTEsXHJcbiAgICBzZWxlY3RlZE9iamVjdHM6IG5ldyBTZXQoKSxcclxuICAgIG11bHRpU2VsZWN0OiBmYWxzZSxcclxuICAgIHNlbGVjdGVkVHlwZTogbnVsbCxcclxuICAgIGNoaWxkcmVuOiBudWxsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5vYmplY3RSZWZzID0gT2JqZWN0LmVudHJpZXMocHJvcHMub2JqZWN0cykubWFwKCgpID0+IGNyZWF0ZVJlZigpKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0SG92ZXJpbmcgPSAoaW5kZXgpID0+IHtcclxuICAgIHRoaXMuc2V0U3RhdGUoeyBob3ZlcmluZzogaW5kZXggfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wSG92ZXJpbmcgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgaG92ZXJpbmc6IC0xIH0pXHJcblxyXG4gIHNlbGVjdE9iamVjdHMgPSBpbmRpY2VzID0+IHtcclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoaW5kaWNlcyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzOiBuZXdTZWxlY3Rpb24gfSk7XHJcblxyXG4gICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxyXG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbkNoYW5nZShBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikpO1xyXG4gIH1cclxuXHJcbiAgY2xpY2tTZWxlY3QgPSAoaW5kZXgsIGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDwn5KhIFByZXZlbnRzIHVzZXIgc2VsZWN0aW5nIGFueSBzdmcgdGV4dFxyXG5cclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuY29tcHV0ZVNlbGVjdGlvbihpbmRleCk7XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGVkT2JqZWN0czogbmV3U2VsZWN0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDimqEgbm90aWZ5IG91dHNpZGUgd29ybGQgb2Ygc2VsZWN0aW9uIGNoYW5nZS4gY29udmVydCBzZXQgdG8gYXJyYXkuXHJcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20obmV3U2VsZWN0aW9uKSk7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGVkVHlwZSA9IChpbmRleCkgPT5cclxuICAgIHRoaXMucHJvcHMub2JqZWN0c1tpbmRleF0udHlwZSA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFR5cGU7XHJcblxyXG4gIHJlbmRlck9iamVjdCA9IChvYmplY3QsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCB7IG9iamVjdFR5cGVzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgT2JqZWN0Q29tcG9uZW50ID0gb2JqZWN0VHlwZXNbb2JqZWN0LnR5cGVdO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxPYmplY3RDb21wb25lbnRcclxuICAgICAgICB7Li4ub2JqZWN0fVxyXG4gICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgbm9kZVJlZj17dGhpcy5vYmplY3RSZWZzW2luZGV4XX1cclxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zdGFydEhvdmVyaW5nKGluZGV4KX1cclxuICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5jbGlja1NlbGVjdChpbmRleCwgZXZlbnQpfVxyXG4gICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5zdG9wSG92ZXJpbmd9XHJcbiAgICAgIC8+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbXVsdGlTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcclxuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gcmVtb3ZlIGZyb20gc2VsZWN0aW9uXHJcbiAgICAgIG9iamVjdHMuZGVsZXRlKGluZGV4KTtcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICAvLyBhZGQgdG8gc2VsZWN0aW9uIG9ubHkgaWYgYWxsb3dlZCAtLVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2VsZWN0ZWRUeXBlKGluZGV4KSB8fCB0aGlzLnByb3BzLm11bHRpcGxlVHlwZVNlbGVjdGlvbikge1xyXG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaW5nbGVTZWxlY3QoaW5kZXgsIG9iamVjdHMpIHtcclxuICAgIGlmIChvYmplY3RzLmhhcyhpbmRleCkpIHsgLy8gZGVzZWxlY3RcclxuICAgICAgb2JqZWN0cy5jbGVhcigpO1xyXG4gICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH0gZWxzZSB7IC8vIHNlbGVjdFxyXG4gICAgICBvYmplY3RzLmNsZWFyKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHNlbGVjdGVkVHlwZTogdGhpcy5wcm9wcy5vYmplY3RzW2luZGV4XS50eXBlXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gb2JqZWN0cy5hZGQoaW5kZXgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcHV0ZVNlbGVjdGlvbihpbmRleCkge1xyXG4gICAgY29uc3QgeyBzZWxlY3RlZE9iamVjdHMsIG11bHRpU2VsZWN0IH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuICAgIGlmIChtdWx0aVNlbGVjdCAmJiBzZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXVsdGlTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5zaW5nbGVTZWxlY3QoaW5kZXgsIHNlbGVjdGVkT2JqZWN0cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZXNlbGVjdEFsbCA9ICgpID0+IHtcclxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkT2JqZWN0cy5zaXplID4gMCkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZE9iamVjdHMgPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRPYmplY3RzIH0pO1xyXG5cclxuICAgICAgLy8g4pqhIG5vdGlmeSBvdXRzaWRlIHdvcmxkIG9mIHNlbGVjdGlvbiBjaGFuZ2UuIGNvbnZlcnQgc2V0IHRvIGFycmF5LlxyXG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uQ2hhbmdlKEFycmF5LmZyb20oc2VsZWN0ZWRPYmplY3RzKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wdXRlSG92ZXJTdGF0ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHsgc2VsZWN0ZWRPYmplY3RzLCBtdWx0aVNlbGVjdCwgaG92ZXJpbmcgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICBjb25zdCB7IG11bHRpcGxlVHlwZVNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAvLyBkb24ndCByZW5kZXIgd2hlbiBvYmplY3QgYWxyZWFkeSBzZWxlY3RlZFxyXG4gICAgaWYgKGhvdmVyaW5nID09PSAtMSB8fCBzZWxlY3RlZE9iamVjdHMuaGFzKGhvdmVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG9uJ3QgcmVuZGVyIHdoZW4gc2VsZWN0aW5nIG9iamVjdHMgb2Ygc2FtZSB0eXBlXHJcbiAgICBpZiAoc2VsZWN0ZWRPYmplY3RzLnNpemUgPiAwICYmIG11bHRpU2VsZWN0KSB7XHJcbiAgICAgIHJldHVybiAodGhpcy5pc1NlbGVjdGVkVHlwZShob3ZlcmluZykgfHwgbXVsdGlwbGVUeXBlU2VsZWN0aW9uKSA/XHJcbiAgICAgICAgaG92ZXJpbmcgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaG92ZXJpbmc7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9iamVjdHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0geyB3aWR0aCwgaGVpZ2h0IH07XHJcbiAgICBjb25zdCB7IHNlbGVjdGVkT2JqZWN0cyB9ID0gdGhpcy5zdGF0ZTtcclxuICAgIGNvbnN0IHNlbGVjdGVkT2JqZWN0c0FycmF5ID0gWy4uLnNlbGVjdGVkT2JqZWN0c107IC8vIENvbnZlcnQgU2V0IHRvIEFycmF5XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEhvdEtleVByb3ZpZGVyIHsuLi5kaW1lbnNpb25zfVxyXG4gICAgICAgIHNldE11bHRpU2VsZWN0PXttdWx0aVNlbGVjdCA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlTZWxlY3QgfSl9XHJcbiAgICAgID5cclxuICAgICAgICA8U1ZHUm9vdCB7Li4uZGltZW5zaW9uc31cclxuICAgICAgICAgIHNlbGVjdGFibGVzPXt0aGlzLm9iamVjdFJlZnN9XHJcbiAgICAgICAgICBzZWxlY3RJbmRpY2VzPXtpbmRpY2VzID0+IHRoaXMuc2VsZWN0T2JqZWN0cyhpbmRpY2VzKX1cclxuICAgICAgICAgIGhvdmVyaW5nPXt0aGlzLmNvbXB1dGVIb3ZlclN0YXRlKCl9XHJcbiAgICAgICAgICBzdG9wSG92ZXI9e3RoaXMuc3RvcEhvdmVyaW5nfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxTdXJmYWNlIGRlc2VsZWN0QWxsPXt0aGlzLmRlc2VsZWN0QWxsfS8+XHJcblxyXG4gICAgICAgICAge29iamVjdHMubWFwKHRoaXMucmVuZGVyT2JqZWN0KX1cclxuXHJcbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuXHJcbiAgICAgICAgICB7c2VsZWN0ZWRPYmplY3RzQXJyYXkubWFwKChvYmplY3RJbmRleCwgaW5kZXgpID0+IChcclxuICAgICAgICAgICAgPFNlbGVjdFJlY3RcclxuICAgICAgICAgICAgICB7Li4uZ2V0QkJveCh0aGlzLm9iamVjdFJlZnNbb2JqZWN0SW5kZXhdKX1cclxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgICAgIHNlbGVjdD17KGV2ZW50KSA9PiB0aGlzLmNsaWNrU2VsZWN0KG9iamVjdEluZGV4LCBldmVudCl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L1NWR1Jvb3Q+XHJcbiAgICAgIDwvSG90S2V5UHJvdmlkZXI+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuIl19